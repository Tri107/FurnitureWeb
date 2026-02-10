import express from 'express';
import accountRoute from './accountRoute.js'
import authRoute from './authRoute.js'
import profileRoute from './profileRoute.js'

const router = express.Router();

router.use('/account',accountRoute)
router.use('/auth',authRoute)
router.use('/profile',profileRoute)

export default router;