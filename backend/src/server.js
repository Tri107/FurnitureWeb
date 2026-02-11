import cors from "cors";
import express from 'express';
import dotenv from 'dotenv';
import { connectMongoDB } from './config/mongodb.js';
import { connectMySQL } from './config/mysql.js';
import allRoutes from './routes/index.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 9999;
app.use('/api', allRoutes);
const startServer = async () => {
  await connectMongoDB();
  await connectMySQL();

  app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
  });
};

startServer();
