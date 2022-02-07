import express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { routes } from './routes';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';

export const client = createClient({
  url: 'redis://redis:6379'
});

dotenv.config();

createConnection().then(async () => {
  await client.connect();

  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(
    cors({
      origin: ['http://localhost:3000']
    })
  );

  routes(app);

  app.listen(8000, () => {
    console.log('Server is up and running on 8000');
  });
});
