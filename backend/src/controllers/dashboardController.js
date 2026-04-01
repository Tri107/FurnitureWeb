import DashboardModel from '../models/dashboardModel.js';

const DashboardController = {
    getWeeklyStats: async (req, res) => {
        try {
            const stats = await DashboardModel.getWeeklyStats();
            return res.status(200).json({ message: "Success", data: stats });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server Error" });
        }
    },
}

export default DashboardController;