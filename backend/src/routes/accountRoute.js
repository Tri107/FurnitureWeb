import express from 'express';
import AccountController from '../controllers/accountController.js';

const router = express.Router();

router.post('/', AccountController.create);
router.put('/:id', AccountController.update);
router.put('/:id/password', AccountController.updatePassword);
router.delete('/:id', AccountController.softDelete);
router.patch('/:id/restore', AccountController.restore);

export default router;