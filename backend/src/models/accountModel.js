import db from '../config/mysql.js';

const AccountModel = {
  findByEmail: async (email) => {
    const query = 'SELECT * FROM accounts WHERE email = ? AND is_disabled = 0';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  },

  createAccount: async (email, passwordHash, isAdmin = false) => {
    const query = `
      INSERT INTO accounts (email, password_hash, created_at, is_admin, is_disabled)
      VALUES (?, ?, NOW(), ?, 0)
    `;
    const [result] = await db.execute(query, [email, passwordHash, isAdmin]);
    return result.insertId;
  },

  // Dành cho Admin set quyền 
  update: async (id, data) => {
    const { is_admin, is_disabled } = data;
    const query = `
      UPDATE accounts 
      SET is_admin = ?, is_disabled = ? 
      WHERE account_id = ?
    `;
    
    const [result] = await db.execute(query, [is_admin, is_disabled, id]);
    return result;
  },

  // Hàm đổi mật khẩu 
  updatePassword: async (id, newPasswordHash) => {
    const query = `UPDATE accounts SET password_hash = ? WHERE account_id = ?`;
    const [result] = await db.execute(query, [newPasswordHash, id]);
    return result;
  },

  softDelete: async (id) => {
    const query = `UPDATE accounts SET is_disabled = 1 WHERE account_id = ?`;
    return await db.execute(query, [id]);
  },

  restore: async (id) => {
    const query = `UPDATE accounts SET is_disabled = 0 WHERE account_id = ?`;
    return await db.execute(query, [id]);
  }
};

export default AccountModel;