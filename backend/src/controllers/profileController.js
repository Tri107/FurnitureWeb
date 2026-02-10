import ProfileModel from '../models/profileModel.js';

const ProfileController = {
  getMyProfile: async (req, res) => {
    try {
      const accountId = req.user.id; 
      const profile = await ProfileModel.getProfileByAccountId(accountId);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      return res.status(200).json({
        message: 'Lấy thông tin thành công',
        data: profile
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updateMyProfile: async (req, res) => {
    try {
      const accountId = req.user.id; 
      const { username, phone_number, address } = req.body;

      
      if (!username && !phone_number && !address) {
        return res.status(400).json({ message: 'Không có dữ liệu để cập nhật' });
      }

      await ProfileModel.updateProfile(accountId, { username, phone_number, address });
      const updatedProfile = await ProfileModel.getProfileByAccountId(accountId);
      return res.status(200).json({
        message: 'Cập nhật profile thành công',
        data: updatedProfile
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server khi cập nhật profile' });
    }
  }
};

export default ProfileController;