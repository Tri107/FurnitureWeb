import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/', categoryController.getCagories);

export default router;