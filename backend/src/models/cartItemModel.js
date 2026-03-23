import db from '../config/mysql.js';
const table_name = 'cart_items';

const CartItemModel = {
    getAll: async (accountId) => {
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name} ci
            JOIN products p ON p.product_id = ci.product_id
            WHERE account_id = ?
        `, [accountId]);
        return rows;
    },

    add: async (accountId, productId, quantity) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (account_id, product_id, quantity) VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
            [accountId, productId, quantity, quantity]
        );
        return result.affectedRows;
    },

    update: async (cartItemId, quantity) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET quantity = ? WHERE cart_item_id = ?`,
            [quantity, cartItemId]
        );
        return result.affectedRows;
    },

    remove: async (cartItemId) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE cart_item_id = ?`,
            [cartItemId]
        );
        return result.affectedRows;
    },

    clearCart: async (accountId) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE account_id = ?`,
            [accountId]
        );
        return result.affectedRows;
    },
};

export default CartItemModel;