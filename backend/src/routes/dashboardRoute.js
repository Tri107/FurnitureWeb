import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/weekly-stats', verifyToken, verifyAdmin, DashboardController.getWeeklyStats);

export default router;