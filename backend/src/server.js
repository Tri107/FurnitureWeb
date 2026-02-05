import express from 'express';
import dotenv from 'dotenv';
import { connectMongoDB } from './config/mongodb.js';
import { connectMySQL } from './config/mysql.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 9999;

const startServer = async () => {
  await connectMongoDB();
  await connectMySQL();

  app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
  });
};

startServer();
