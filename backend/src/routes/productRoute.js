import express from 'express';
import productController from '../controllers/productController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; 
import { uploadMultiple } from '../middlewares/uploadMiddleware.js';


const router = express.Router();

router.get('/',verifyToken, productController.getAll);
router.get('/:id', verifyToken, productController.getById);
router.post('/add-product', verifyToken, productController.create);
router.post('/add-variant', verifyToken, productController.createVariant);
router.post('/upload', verifyToken, uploadMultiple, productController.uploadImages);


export default router;