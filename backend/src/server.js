import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 
import http from 'http';
import { connectMongoDB } from './config/mongodb.js';
import { connectMySQL } from './config/mysql.js';
import allRoutes from './routes/index.js';
import dbErrorHandler from './middlewares/dbErrorHandler.js';
import { setupSocket } from './socket.js';

dotenv.config();

const app = express();

//  Tạo HTTP server từ express phải dùng socket
const server = http.createServer(app);

//  Khởi tạo Socket.IO
setupSocket(server);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser()); 

const PORT = process.env.PORT || 9999;
app.use('/api', allRoutes);
app.use(dbErrorHandler); 




const startServer = async () => {
  try {
    await connectMongoDB();
    await connectMySQL();

    server.listen(PORT, () => {
      console.log(`Server đang chạy tại cổng ${PORT}`);
    });
  } catch (error) {
    console.error("Lỗi khởi động server:", error);
    process.exit(1);
  }
};

startServer();