import db from '../config/mysql.js';
import mongoose from "mongoose";
import Variant from "../models/variantModel.js";

const table_name = 'cart_items';

const isValidObjectId = (str) => /^[a-fA-F0-9]{24}$/.test(str);

const CartItemModel = {
    getAll: async (accountId) => {
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name} ci
            JOIN products p ON p.product_id = ci.product_id
            WHERE account_id = ?
        `, [accountId]);

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

    add: async (accountId, productId, quantity, price, material, color) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (account_id, product_id, quantity, price, material, color) VALUES (?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE quantity = quantity + ?, price = VALUES(price), material = VALUES(material), color = VALUES(color)`,
            [accountId, productId, quantity, price, material, color, quantity]
        );
        return result.affectedRows;
    },

    update: async (cartItemId, quantity) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET quantity = ? WHERE cart_item_id = ?`,
            [quantity, cartItemId]
        );
        return result.affectedRows;
    },

    updateColor: async (cartItemId, color) => {
        const [cartRows] = await db.query(
            `SELECT ci.product_id, ci.quantity, p.variant_ref FROM ${table_name} ci JOIN products p ON p.product_id = ci.product_id WHERE ci.cart_item_id = ?`,
            [cartItemId]
        );

        if (cartRows.length === 0) {
            throw new Error('Cart item not found');
        }

        const { product_id, quantity, variant_ref } = cartRows[0];

        if (!variant_ref || !isValidObjectId(variant_ref)) {
            throw new Error('Invalid variant reference');
        }

        const variantDoc = await Variant.findById(variant_ref).lean();
        if (!variantDoc) {
            throw new Error('Variant not found');
        }

        const selectedVariant = variantDoc.variants.find(v => v.specs?.color?.trim() === color.trim());
        if (!selectedVariant) {
            throw new Error('Variant with specified color not found');
        }

        const newPrice = selectedVariant.price;

        // Update color và unit price
        const [result] = await db.query(
            `UPDATE ${table_name} SET color = ?, price = ? WHERE cart_item_id = ?`,
            [color, newPrice, cartItemId]
        );

        return result.affectedRows;
    },

    remove: async (cartItemId) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE cart_item_id = ?`,
            [cartItemId]
        );
        return result.affectedRows;
    },

    clearCart: async (accountId) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE account_id = ?`,
            [accountId]
        );
        return result.affectedRows;
    },
};

export default CartItemModel;