import db from '../config/mysql.js';
const table_name = 'favorites';

const FavoriteModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name}
        `);
        return rows;
    },

    add: async (accountId, productId) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (account_id, product_id) VALUES (?, ?)`,
            [accountId, productId]
        );
        return result.affectedRows;
    },

    remove: async (accountId, productId) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE account_id = ? AND product_id = ?`,
            [accountId, productId]
        );
        return result.affectedRows;
    },
};

export default FavoriteModel;
