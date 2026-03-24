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

    add: async (accountId, productId, sku, quantity, snapshot) => {
        const snapshotStr = JSON.stringify(snapshot);
        const [result] = await db.query(
            `INSERT INTO ${table_name} (account_id, product_id, sku, quantity, snapshot) VALUES (?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE quantity = quantity + ?, snapshot = VALUES(snapshot)`,
            [accountId, productId, sku, quantity, snapshotStr, quantity]
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