// src/services/email.service.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn
    pass: process.env.EMAIL_PASS  // Mật khẩu ứng dụng (App Password)
  }
});

export const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Furniture Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Xác thực đăng ký tài khoản',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Xin chào!</h2>
          <p>Bạn đang đăng ký tài khoản tại Furniture Shop.</p>
          <p>Mã xác thực (OTP) của bạn là:</p>
          <h1 style="color: #e63946; letter-spacing: 5px;">${otp}</h1>
          <p>Mã này sẽ hết hạn trong <b>5 phút</b>.</p>
          <p>Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Lỗi gửi mail:', error);
    return false;
  }
};