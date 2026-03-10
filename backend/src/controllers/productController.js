import ProductModel from "../models/productModel.js";

const ProductController = {
  getAll: async (req, res) => {
    try {
      const products = await ProductModel.getAll();
      return res.status(200).json({
        message: "Lấy danh sách sản phẩm thành công",
        data: products,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi lấy danh sách sản phẩm" });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.getById(id);

      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      return res.status(200).json({
        message: "Lấy thông tin sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi lấy thông tin sản phẩm" });
    }
  },
};

export default ProductController;
