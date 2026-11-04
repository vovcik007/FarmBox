import { createServer } from 'node:http';
import pg from 'pg';
import { reserve, validProductId, validQuantity } from './reservations.js';

export function createApp(pool?: pg.Pool) {
  return createServer(async (request, response) => {
    if (request.method === 'GET' && request.url === '/health') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ status: 'ok' }));
      return;
    }
    if (request.method === 'POST' && request.url === '/reservations' && pool) {
      let data: unknown;
      try {
        let body = '';
        for await (const chunk of request) {
          body += String(chunk);
          if (body.length > 4096) throw new Error('body too large');
        }
        data = JSON.parse(body);
      } catch {
        response.writeHead(400).end();
        return;
      }
      if (!data || typeof data !== 'object' || !('productId' in data) || !validProductId(data.productId) || !('quantity' in data) || !validQuantity(data.quantity)) {
        response.writeHead(400).end();
        return;
      }
      try {
        const reserved = await reserve(pool, data.productId, data.quantity);
        response.writeHead(reserved ? 201 : 409, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ reserved }));
      } catch {
        response.writeHead(500).end();
      }
      return;
    }
    response.writeHead(404).end();
  });
}
