import express from 'express';
import brandController from '../controllers/brandController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/', brandController.getBrands);
router.post('/', brandController.createBrand);
router.put('/:brandId', brandController.updateBrand);
router.delete('/:brandId', brandController.deleteBrand);

export default router;