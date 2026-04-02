import db from '../config/mysql.js';

const DashboardModel = {
    getWeeklyStats: async () => {
        const [rows] = await db.query(
            `SELECT * FROM view_weekly_stats`
        );
        return rows;
    },

    getChartData: async (fromDate, toDate) => {
        const [rows] = await db.query(
            `SELECT stats_date, total_revenue, PENDING, DELIVERING, DELIVERED, CANCELLED 
             FROM view_get_chart_data
             WHERE stats_date BETWEEN ? AND ?`,
            [fromDate, toDate]
        );
        return rows;
    },
}

export default DashboardModel;