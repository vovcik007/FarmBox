import { test } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { initialize, reserve, reserveIdempotently } from '../../src/reservations.js';

test('connects to isolated PostgreSQL', async () => {
  assert.ok(process.env.DATABASE_URL, 'DATABASE_URL is required');
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const result = await pool.query('SELECT 1 AS value');
    assert.equal(result.rows[0].value, 1);
  } finally { await pool.end(); }
});

test('idempotency replays results and rejects conflicting requests, including concurrent retries', async () => {
  assert.ok(process.env.DATABASE_URL, 'DATABASE_URL is required');
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const productId = `test-${crypto.randomUUID()}`;
  const key = `key-${crypto.randomUUID()}`;
  try {
    await initialize(pool);
    await pool.query('INSERT INTO stock (product_id, quantity) VALUES ($1, 3)', [productId]);
    assert.deepEqual(await Promise.all([reserveIdempotently(pool, key, productId, 2), reserveIdempotently(pool, key, productId, 2)]), ['reserved', 'reserved']);
    assert.equal(await reserveIdempotently(pool, key, productId, 2), 'reserved');
    assert.equal(await reserveIdempotently(pool, key, productId, 1), 'conflict');
    assert.equal((await pool.query('SELECT quantity FROM stock WHERE product_id = $1', [productId])).rows[0].quantity, 1);
  } finally {
    await pool.query('DELETE FROM reservation_requests WHERE idempotency_key = $1', [key]);
    await pool.query('DELETE FROM stock WHERE product_id = $1', [productId]);
    await pool.end();
  }
});

test('atomic reservations respect available stock under concurrency', async () => {
  assert.ok(process.env.DATABASE_URL, 'DATABASE_URL is required');
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const productId = `test-${crypto.randomUUID()}`;
  try {
    await initialize(pool);
    await pool.query('INSERT INTO stock (product_id, quantity) VALUES ($1, 3)', [productId]);
    const results = await Promise.all([reserve(pool, productId, 2), reserve(pool, productId, 2)]);
    assert.equal(results.filter(Boolean).length, 1);
    const remaining = await pool.query('SELECT quantity FROM stock WHERE product_id = $1', [productId]);
    assert.equal(remaining.rows[0].quantity, 1);
    assert.equal(await reserve(pool, productId, 2), false);
  } finally {
    await pool.query('DELETE FROM stock WHERE product_id = $1', [productId]);
    await pool.end();
  }
});
