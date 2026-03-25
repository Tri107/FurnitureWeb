import db from "../config/mysql.js";
import Variant from "./variantModel.js";

const OrderModel = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT o.*, a.email 
       FROM orders o 
       JOIN accounts a ON o.account_id = a.account_id 
       ORDER BY o.order_date DESC`
    );
    return rows;
  },

  getById: async (orderId) => {
    const [orderRows] = await db.query(
      `SELECT o.*, a.email, a.is_admin, up.username, up.phone_number, up.user_address 
       FROM orders o 
       JOIN accounts a ON o.account_id = a.account_id 
       JOIN user_profiles up ON o.account_id = up.account_id
       WHERE o.order_id = ?`,
      [orderId]
    );
    if (!orderRows.length) return null;
    
    const [itemRows] = await db.query(
      `SELECT oi.quantity, oi.product_id, p.product_name, oi.variant_snapshot, oi.order_id, oi.discount_id
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.product_id 
       WHERE oi.order_id = ?`,
      [orderId]
    );
    
    return { ...orderRows[0], items: itemRows };
  },

  getByAccountId: async (accountId) => {
    const [rows] = await db.query(
      `SELECT o.order_id, o.total_price, o.order_status, o.order_date, a.email 
       FROM orders o 
       JOIN accounts a ON o.account_id = a.account_id 
       WHERE o.account_id = ?
       ORDER BY o.order_date DESC`,
      [accountId]
    );
    return rows;
  },

  create: async (orderData) => {
    const { account_id, total_price, items, address, note } = orderData;
    // Use manual transaction over the connection
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert Order
      const [orderResult] = await connection.query(
        `INSERT INTO orders (total_price, account_id, address, note) VALUES (?, ?, ?, ?)`,
        [total_price, account_id, address || null, note || null]
      );
      const orderId = orderResult.insertId;

      // Insert Order Items
      for (let item of items) {
        // Find Variant in MongoDB to record snapshot
        const variantDoc = await Variant.findOne({ "variants.sku": item.sku }).lean();
        if (!variantDoc) throw new Error(`Variant document not found for SKU: ${item.sku}`);

        const specificVariant = variantDoc.variants.find(v => v.sku === item.sku);
        if (!specificVariant) {
          throw new Error(`Variant SKU ${item.sku} not found inside document`);
        }

        const { _id, ...variantData } = specificVariant;
        const variant_snapshot = JSON.stringify(variantData);

        await connection.query(
          `INSERT INTO order_items (quantity, product_id, variant_snapshot, order_id, discount_id) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            item.quantity, 
            item.product_id, 
            variant_snapshot, 
            orderId, 
            item.discount_id || null
          ]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  updateStatus: async (orderId, newStatus) => {
    const [result] = await db.query(
      `UPDATE orders SET order_status = ? WHERE order_id = ?`,
      [newStatus, orderId]
    );
    return result.affectedRows > 0;
  }
};

export default OrderModel;