import db from '../config/mysql.js';
const table_name = 'categories';

const CategoryModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name}
        `);
        return rows;
    },
};

export default CategoryModel;