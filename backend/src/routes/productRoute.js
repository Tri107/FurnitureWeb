import express from 'express';
import productController from '../controllers/productController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; 


const router = express.Router();

router.get('/',verifyToken, productController.getAll);
router.get('/:id', verifyToken, productController.getById);


export default router;