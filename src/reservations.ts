import pg from 'pg';

export function validProductId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(value);
}

export function validQuantity(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= 2147483647;
}

export async function initialize(pool: pg.Pool): Promise<void> {
  await pool.query('CREATE TABLE IF NOT EXISTS stock (product_id TEXT PRIMARY KEY, quantity INTEGER NOT NULL CHECK (quantity >= 0))');
  await pool.query(`CREATE TABLE IF NOT EXISTS reservation_requests (
    idempotency_key TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    reserved BOOLEAN
  )`);
}

export async function reserve(pool: pg.Pool, productId: string, quantity: number): Promise<boolean> {
  if (!validQuantity(quantity)) throw new Error('invalid quantity');
  const result = await pool.query(
    'UPDATE stock SET quantity = quantity - $2 WHERE product_id = $1 AND quantity >= $2 RETURNING quantity',
    [productId, quantity],
  );
  return result.rowCount === 1;
}

export async function reserveIdempotently(pool: pg.Pool, key: string, productId: string, quantity: number): Promise<'reserved' | 'insufficient' | 'conflict'> {
  if (!validProductId(productId) || !validQuantity(quantity) || !/^[A-Za-z0-9_-]{1,128}$/.test(key)) throw new Error('invalid request');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const inserted = await client.query('INSERT INTO reservation_requests (idempotency_key, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING idempotency_key', [key, productId, quantity]);
    if (inserted.rowCount === 0) {
      const previous = await client.query('SELECT product_id, quantity, reserved FROM reservation_requests WHERE idempotency_key = $1', [key]);
      const record = previous.rows[0];
      await client.query('COMMIT');
      if (record.product_id !== productId || record.quantity !== quantity) return 'conflict';
      return record.reserved ? 'reserved' : 'insufficient';
    }
    const result = await client.query('UPDATE stock SET quantity = quantity - $2 WHERE product_id = $1 AND quantity >= $2 RETURNING quantity', [productId, quantity]);
    const reserved = result.rowCount === 1;
    await client.query('UPDATE reservation_requests SET reserved = $2 WHERE idempotency_key = $1', [key, reserved]);
    await client.query('COMMIT');
    return reserved ? 'reserved' : 'insufficient';
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
