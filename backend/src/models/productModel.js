import db from "../config/mysql.js";
import mongoose from "mongoose";
import Variant from "../models/variantModel.js";

const ProductModel = {
  getAll: async () => {
    const [rows] = await db.query(`SELECT * FROM products`);

    const variantIds = rows
      .filter((r) => r.variant_ref)
      .map((r) => new mongoose.Types.ObjectId(r.variant_ref));

    const variants = await Variant.find({
      _id: { $in: variantIds },
    }).lean();

    const variantMap = {};

    variants.forEach((v) => {
      variantMap[v._id.toString()] = v;
    });

    rows.forEach((row) => {
      row.variants = variantMap[row.variant_ref] || null;
    });

    return rows;
  },


  getById: async (productId) => {

    const [rows] = await db.query(
      `SELECT * FROM products WHERE product_id = ?`,
      [productId]
    );

    const product = rows[0];

    if (!product) {
      return null;
    }

    if (product.variant_ref) {
      const objectId = new mongoose.Types.ObjectId(product.variant_ref);
      const variant = await Variant.findById(objectId).lean();

      product.variants = variant || null;
    } else {
      product.variants = null;
      product.variants = null;
    }

    return product;
  },
};

export default ProductModel;
