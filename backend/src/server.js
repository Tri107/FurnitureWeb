import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 

import { connectMongoDB } from './config/mongodb.js';
import { connectMySQL } from './config/mysql.js';
import allRoutes from './routes/index.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true // Cho phép gửi/nhận cookie
}));

app.use(express.json());
app.use(cookieParser()); 

const PORT = process.env.PORT || 9999;
app.use('/api', allRoutes);
const startServer = async () => {
  try {
    await connectMongoDB();
    await connectMySQL();

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại cổng ${PORT}`);
    });
  } catch (error) {
    console.error("Lỗi khởi động server:", error);
    process.exit(1);
  }
};

startServer();