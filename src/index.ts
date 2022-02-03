import express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { routes } from './routes';
import dotenv from 'dotenv';

dotenv.config();

createConnection().then(() => {
  const app = express();

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
