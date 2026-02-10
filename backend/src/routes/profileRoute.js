import express from 'express';
import ProfileController from '../controllers/profileController.js';

const router = express.Router();

router.get('/me', ProfileController.getMyProfile);
router.put('/update', ProfileController.updateMyProfile);

export default router;