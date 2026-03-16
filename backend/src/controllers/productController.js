import ProductModel from "../models/productModel.js";
import { uploadToR2, uploadMultipleToR2 } from "../utils/r2Upload.js";

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

  create: async (req, res) => {
    try {
      const {
        product_name,
        product_description,
        category_id,
        brand_id,
        collection_id,
        variant_ref,
      } = req.body;

      if (!product_name || !category_id || !brand_id || !collection_id || !variant_ref) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
      }

      const productId = await ProductModel.create({
        product_name,
        product_description,
        category_id,
        brand_id,
        collection_id,
        variant_ref,
      });

      return res.status(201).json({
        message: "Tạo sản phẩm thành công",
        data: { product_id: productId },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi tạo sản phẩm" });
    }
  },

  createVariant: async (req, res) => {
    try {
      const { price, stock, specs, url } = req.body;

      if (!price) {
        return res.status(400).json({ message: "Thiếu thông tin giá sản phẩm" });
      }

      const variantId = await ProductModel.createVariant({
        price,
        stock,
        specs,
        url,
      });

      return res.status(201).json({
        message: "Tạo variant thành công",
        data: { variant_id: variantId },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi tạo variant" });
    }
  },

  uploadImages: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Không có file nào được gửi" });
      }

      const results = await uploadMultipleToR2(req.files, "images");
      const urls = results.map((r) => r.url);

      return res.status(200).json({
        message: "Upload ảnh thành công",
        data: { urls },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi upload ảnh" });
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