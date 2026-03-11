import express from 'express';
import accountRoute from './accountRoute.js'
import authRoute from './authRoute.js'
import profileRoute from './profileRoute.js'
import categoryRoute from './categoryRoute.js'
import brandRoute from './brandRoute.js'
import collectionRoute from './collectionRoute.js'
import discountRoute from './discountRoute.js'
import paymentRoute from './paymentRoute.js'
import favoriteRoute from './favoriteRoute.js'
import reviewRoute from './reviewRoute.js'
import productRoute from './productRoute.js'

const router = express.Router();

router.use('/account',accountRoute)
router.use('/auth',authRoute)
router.use('/profile',profileRoute)
router.use('/categories',categoryRoute)
router.use('/brands',brandRoute)
router.use('/collections',collectionRoute)
router.use('/discounts',discountRoute)
router.use('/payments',paymentRoute)
router.use('/favorites',favoriteRoute)
router.use('/reviews', reviewRoute)
router.use('/products', productRoute)

export default router;