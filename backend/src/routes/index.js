import express from 'express';
import accountRoute from './accountRoute.js'
import authRoute from './authRoute.js'
import profileRoute from './profileRoute.js'
import categoryRoute from './categoryRoute.js'

const router = express.Router();

router.use('/account',accountRoute)
router.use('/auth',authRoute)
router.use('/profile',profileRoute)
router.use('/categories',categoryRoute)

export default router;