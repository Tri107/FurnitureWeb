import db from '../config/mysql.js';

const DashboardModel = {
    getWeeklyStats: async () => {
        const [rows] = await db.query(
            `SELECT * FROM view_weekly_stats`
        );
        return rows;
    },
}

export default DashboardModel;