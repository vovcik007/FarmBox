import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../../src/app.js';

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
