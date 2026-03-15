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

  getFeaturedProducts: async (req, res) => {
    try {
      const { limit = 8, sort = "newest" } = req.query;

      const products = await ProductModel.getFeaturedProducts(limit, sort);

      return res.status(200).json({
        message: "Lấy sản phẩm nổi bật thành công",
        data: products,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Lỗi server khi lấy sản phẩm nổi bật",
      });
    }
  },

  getHomeCollections: async (req, res) => {
    try {
      const { limit = 4 } = req.query;
      const collections = await ProductModel.getHomeCollections(limit);

      return res.status(200).json({
        message: "Lấy collection homepage thành công",
        data: collections,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Lỗi server khi lấy collection homepage",
      });
    }
  },
};

export default ProductController;