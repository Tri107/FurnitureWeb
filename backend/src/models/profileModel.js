import db from '../config/mysql.js';

const ProfileModel = {
  // Tạo profile mặc định
  createDefaultProfile: async (accountId) => {
    try {
      const defaultUsername = `user_${accountId}`; 

      const query = `
        INSERT INTO user_profiles (account_id, username, phone_number, user_address) 
        VALUES (?, ?, NULL, NULL)
      `;
      const [result] = await db.execute(query, [accountId, defaultUsername]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getProfileByAccountId: async (accountId) => {
    try {
      
      const query = `SELECT * FROM user_profiles WHERE account_id = ?`;
      const [rows] = await db.execute(query, [accountId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  
  updateProfile: async (accountId, data) => {
    try {
      
      const { username, phone_number, address } = data;
      
      const query = `
        UPDATE user_profiles 
        SET username = ?, phone_number = ?, user_address = ? 
        WHERE account_id = ?
      `;
      // Map biến address (từ frontend) vào cột user_address (trong DB)
      const [result] = await db.execute(query, [username, phone_number, address, accountId]);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

export default ProfileModel;