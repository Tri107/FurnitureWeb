// src/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // [FIX] Bổ sung import này
import AccountModel from '../models/accountModel.js'; // Đảm bảo tên file model đúng
import ProfileModel from '../models/profileModel.js';
import { sendOTP } from '../utils/sendEmail.js';
import { OAuth2Client } from 'google-auth-library';

// Kho lưu trữ tạm thời
const tempRegisterStore = new Map();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const AuthController = {

  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập đủ email và mật khẩu' });
      }

      const existingUser = await AccountModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email này đã được sử dụng' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Lưu vào bộ nhớ tạm 
      tempRegisterStore.set(email, {
        passwordHash: passwordHash,
        otp: otp,
        expireAt: Date.now() + 5 * 60 * 1000 
      });

      // Gửi mail
      const isSent = await sendOTP(email, otp);

      if (!isSent) {
        tempRegisterStore.delete(email); 
        return res.status(500).json({ message: 'Lỗi khi gửi email OTP. Vui lòng thử lại.' });
      }

      return res.status(200).json({ 
        message: 'Mã OTP đã được gửi đến email. Vui lòng kiểm tra để xác nhận.',
        email: email
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  verifyRegister: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ message: 'Thiếu thông tin xác thực' });
      }

      const tempData = tempRegisterStore.get(email);

      if (!tempData) {
        return res.status(400).json({ message: 'Yêu cầu đăng ký không tồn tại hoặc đã hết hạn' });
      }
      if (tempData.otp !== otp) {
        return res.status(400).json({ message: 'Mã OTP không chính xác' });
      }

      if (Date.now() > tempData.expireAt) {
        tempRegisterStore.delete(email);
        return res.status(400).json({ message: 'Mã OTP đã hết hạn' });
      }

      const newAccountId = await AccountModel.createAccount(email, tempData.passwordHash, false);
      await ProfileModel.createDefaultProfile(newAccountId);

      tempRegisterStore.delete(email);
      return res.status(201).json({ 
        message: 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.',
        account_id: newAccountId
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server khi lưu database' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
      }

      const user = await AccountModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
      }
      const isMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
      }

      
      const token = jwt.sign(
        { 
          id: user.account_id, 
          email: user.email, 
          role: user.is_admin ? 'admin' : 'user' 
        },
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }     
      );

      return res.status(200).json({
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: user.account_id,
          email: user.email,
          role: user.is_admin ? 'admin' : 'user'
        }
      });

    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  googleLogin: async (req, res) => {
    try {
      const { token } = req.body; 

      if (!token) {
        return res.status(400).json({ message: 'Thiếu Google Token' });
      }

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, 
      });
      
      const payload = ticket.getPayload();
      const { email, email_verified } = payload;

      if (!email_verified) {
        return res.status(400).json({ message: 'Email Google chưa được xác thực' });
      }

      let user = await AccountModel.findByEmail(email);

      if (!user) {
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(randomPassword, salt);

        const newAccountId = await AccountModel.createAccount(email, passwordHash, false);
        await ProfileModel.createDefaultProfile(newAccountId);
        
       
        user = { 
          account_id: newAccountId, 
          email: email, 
          is_admin: 0 
        };
      }

      const jwtToken = jwt.sign(
        { 
          id: user.account_id, 
          email: user.email, 
          role: user.is_admin ? 'admin' : 'user' 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        message: 'Đăng nhập Google thành công',
        token: jwtToken,
        user: {
          id: user.account_id,
          email: user.email,
          role: user.is_admin ? 'admin' : 'user'
        }
      });

    } catch (error) {
      console.error('Google Login Error:', error);
      return res.status(400).json({ message: 'Token Google không hợp lệ hoặc đã hết hạn' });
    }
  }
};

export default AuthController;