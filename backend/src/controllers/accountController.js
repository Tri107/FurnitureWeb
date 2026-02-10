import bcrypt from 'bcrypt';
import AccountModel from '../models/accountModel.js';
import ProfileModel from '../models/profileModel.js'; 
const AccountController = {
  create: async (req, res) => {
    try {
      const { email, password, is_admin } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp email và password' });
      }
      //kiểm tra email đã tồn tại
      const existingUser = await AccountModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      // Tạo Account (Model mặc định Is_disabled = 0)
      const newAccountId = await AccountModel.createAccount(email, passwordHash, is_admin);
      // Tự động tạo Profile rỗng
      await ProfileModel.createDefaultProfile(newAccountId);
      return res.status(201).json({ 
        message: 'Tạo tài khoản thành công', 
        account_id: newAccountId 
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server khi tạo tài khoản' });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { is_admin, is_disabled } = req.body;
      if (is_admin === undefined || is_disabled === undefined) {
        return res.status(400).json({ 
          message: 'Dữ liệu không hợp lệ. Vui lòng gửi cả is_admin và is_disabled' 
        });
      }

      await AccountModel.update(id, { is_admin, is_disabled });
      return res.status(200).json({ message: 'Cập nhật trạng thái tài khoản thành công' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { new_password } = req.body;

      if (!new_password) {
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu mới' });
      }

      // Hash mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(new_password, salt);
      await AccountModel.updatePassword(id, newPasswordHash);
      return res.status(200).json({ message: 'Đổi mật khẩu thành công' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },
  softDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await AccountModel.softDelete(id);
      return res.status(200).json({ message: 'Đã vô hiệu hóa tài khoản (Soft Delete)' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  restore: async (req, res) => {
    try {
      const { id } = req.params;
      await AccountModel.restore(id);
      return res.status(200).json({ message: 'Đã khôi phục tài khoản thành công' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
};

export default AccountController;