import { createApp } from './app.js';
import pg from 'pg';
import { initialize } from './reservations.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
initialize(pool).then(() => createApp(pool).listen(Number(process.env.PORT ?? 3000))).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
