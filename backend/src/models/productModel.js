import db from "../config/mysql.js";
import mongoose from "mongoose";
import Variant from "../models/variantModel.js";

const isValidObjectId = (str) => /^[a-fA-F0-9]{24}$/.test(str);

const ProductModel = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        c.category_name,
        b.brand_name,
        cl.collection_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN collections cl ON p.collection_id = cl.collection_id
      WHERE p.is_disabled = 0
      ORDER BY p.created_at DESC
    `);

    const variantIds = rows
      .filter((r) => r.variant_ref && isValidObjectId(r.variant_ref))
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
      `
      SELECT 
        p.*,
        c.category_name,
        b.brand_name,
        cl.collection_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN collections cl ON p.collection_id = cl.collection_id
      WHERE p.product_id = ? AND p.is_disabled = 0
      `,
      [productId]
    );

    const product = rows[0];

    if (!product) {
      return null;
    }

    if (product.variant_ref && isValidObjectId(product.variant_ref)) {
      const objectId = new mongoose.Types.ObjectId(product.variant_ref);
      const variant = await Variant.findById(objectId).lean();

      product.variants = variant || null;
    } else {
      product.variants = null;
    }

    return product;
  },

  create: async (productData) => {
    const {
      product_name,
      product_description,
      category_id,
      brand_id,
      collection_id,
      variant_ref,
    } = productData;

    await db.query(`CALL add_new_product(?, ?, ?, ?, ?, ?)`, [
      product_name,
      product_description || null,
      category_id,
      brand_id,
      collection_id,
      variant_ref,
    ]);

    // Lấy ID sản phẩm vừa thêm
    const [[{ id }]] = await db.query(`SELECT LAST_INSERT_ID() AS id`);
    return id;
  },

  createVariant: async (variantData) => {
    const { price, stock, specs, url } = variantData;

    const variant = new Variant({
      price,
      stock,
      specs,
      url,
    });

    const saved = await variant.save();
    return saved._id.toString();
  },
};

export default ProductModel;