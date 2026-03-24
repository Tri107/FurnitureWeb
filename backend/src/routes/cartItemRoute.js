import express from 'express';
import cartItemController from '../controllers/cartItemController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/:accountId', verifyToken, cartItemController.getCartItems);
router.post('/', verifyToken, cartItemController.addCartItem);
router.put('/:cartItemId', verifyToken, cartItemController.updateCartItem);
router.patch('/:cartItemId/color', verifyToken, cartItemController.updateCartItemColor);
router.delete('/:cartItemId', verifyToken, cartItemController.removeCartItem);
router.delete('/clear', verifyToken, cartItemController.clearCart);

export default router;