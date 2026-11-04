import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../../src/app.js';
import { validProductId, validQuantity } from '../../src/reservations.js';

test('rejects invalid product identifiers', () => {
  for (const value of ['', ' ', 'a\u0000b', 'a'.repeat(129), '../other']) assert.equal(validProductId(value), false);
  assert.equal(validProductId('farm-box_42'), true);
});

test('validates reservation quantity', () => {
  for (const value of [0, -1, 1.5, NaN, 2147483648, '1', null]) assert.equal(validQuantity(value), false);
  assert.equal(validQuantity(1), true);
});

test('health endpoint reports service status', async () => {
  const server = createApp().listen(0, '127.0.0.1');
  try {
    await new Promise<void>(resolve => server.once('listening', resolve));
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const response = await fetch(`http://127.0.0.1:${address.port}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  } finally { server.close(); }
});
