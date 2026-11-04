import pg from 'pg';

export function validProductId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(value);
}

export function validQuantity(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= 2147483647;
}

export async function initialize(pool: pg.Pool): Promise<void> {
  await pool.query('CREATE TABLE IF NOT EXISTS stock (product_id TEXT PRIMARY KEY, quantity INTEGER NOT NULL CHECK (quantity >= 0))');
}

export async function reserve(pool: pg.Pool, productId: string, quantity: number): Promise<boolean> {
  if (!validQuantity(quantity)) throw new Error('invalid quantity');
  const result = await pool.query(
    'UPDATE stock SET quantity = quantity - $2 WHERE product_id = $1 AND quantity >= $2 RETURNING quantity',
    [productId, quantity],
  );
  return result.rowCount === 1;
}
