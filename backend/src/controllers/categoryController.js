import categoryModel from '../models/categoryModel.js';

const categoryController = {
    getCagories : async (req, res) => {
        try {
            const rows = await categoryModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default categoryController;