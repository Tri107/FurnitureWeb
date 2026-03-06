import db from '../config/mysql.js';
const table_name = 'reviews';

const ReviewModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name}
        `);
        return rows;
    },

    create: async (review) => {
        const { rating, reviewComment, productId, accountId } = review;
        const [result] = await db.query(
            `INSERT INTO ${table_name} (rating, review_comment, product_id, account_id) VALUES (?, ?, ?, ?)`,
            [rating, reviewComment, productId, accountId]
        );
        return result.insertId;
    },

    update: async (reviewId, review) => {
        const { rating, reviewComment } = review;
        const [result] = await db.query(
            `UPDATE ${table_name} SET rating = ?, review_comment = ? WHERE review_id = ?`,
            [rating, reviewComment, reviewId]
        );
        return result.affectedRows;
    },

    delete: async (reviewId) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE review_id = ?`,
            [reviewId]
        );
        return result.affectedRows;
    },
};

export default ReviewModel;
