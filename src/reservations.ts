import pg from 'pg';

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
