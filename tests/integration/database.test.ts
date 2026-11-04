import { test } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';

test('connects to isolated PostgreSQL', async () => {
  assert.ok(process.env.DATABASE_URL, 'DATABASE_URL is required');
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const result = await pool.query('SELECT 1 AS value');
    assert.equal(result.rows[0].value, 1);
  } finally { await pool.end(); }
});
