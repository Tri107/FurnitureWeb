import express from 'express'
import dotenv from 'dotenv'

const app = express();
dotenv.config();
const PORT = process.env.PORT || 9999

app.listen(PORT,()=>{
    console.log(`Server đang chạy tại cổng ${PORT}`);
});