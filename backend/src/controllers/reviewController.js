import reviewModel from '../models/reviewModel.js';

const reviewController = {
    getReviews: async (req, res) => {
        try {
            const rows = await reviewModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createReview: async (req, res) => {
        try {
            const { rating, reviewComment, productId, accountId } = req.body;
            if (!rating || !productId || !accountId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            const reviewId = await reviewModel.create({ rating, reviewComment, productId, accountId });
            res.status(201).json({ success: true, reviewId });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    updateReview: async (req, res) => {
        try {
            const { reviewId } = req.params;
            const { rating, reviewComment } = req.body;
            if (!rating || !reviewComment) {
                return res.status(400).json({ message: 'Invalid input' });
            }
            const affectedRows = await reviewModel.update(reviewId, { rating, reviewComment });
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Review not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    deleteReview: async (req, res) => {
        try {
            const { reviewId } = req.params;
            const affectedRows = await reviewModel.delete(reviewId);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Review not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default reviewController;
