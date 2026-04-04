import ProductModel from "../models/productModel.js";
import OrderModel from "../models/orderModel.js";

/**
 * Distribute `itemCount` items evenly across `totalRows` rows.
 * Returns array of { startOffset, span } for each item.
 *
 * Examples:
 *   distributeRows(2, 4) → [{startOffset:0, span:2}, {startOffset:2, span:2}]
 *   distributeRows(4, 4) → [{startOffset:0, span:1}, ... x4]
 *   distributeRows(1, 4) → [{startOffset:0, span:4}]
 *   distributeRows(3, 4) → [{startOffset:0, span:2}, {startOffset:2, span:1}, {startOffset:3, span:1}]
 *   distributeRows(0, 4) → [] (no items, nothing to place)
 */
const distributeRows = (itemCount, totalRows) => {
  if (itemCount === 0) return [];

  const result = [];
  const baseSpan = Math.floor(totalRows / itemCount);
  const extra = totalRows % itemCount;

  let offset = 0;
  for (let i = 0; i < itemCount; i++) {
    const span = baseSpan + (i < extra ? 1 : 0);
    result.push({ startOffset: offset, span });
    offset += span;
  }
  return result;
};

const ExportController = {
  /**
   * Prepare product data for Excel export.
   * Uses dynamic merge distribution so images and variants each fill
   * the product's row span evenly — no empty cells.
   */
  formatProducts: async (req, res, next) => {
    try {
      const products = await ProductModel.getAll();

      // --- Column definitions ---
      const columns = [
        { header: "ID", key: "id", width: 6 },
        { header: "Tên sản phẩm", key: "name", width: 30 },
        { header: "Mô tả", key: "description", width: 40 },
        { header: "Trạng thái SP", key: "status", width: 16 },
        { header: "Danh mục", key: "category", width: 18 },
        { header: "Thương hiệu", key: "brand", width: 18 },
        { header: "3D URL", key: "model3d", width: 20 },
        { header: "Hình ảnh URL", key: "image_url", width: 35 },
        { header: "SKU", key: "sku", width: 20 },
        { header: "Giá", key: "price", width: 14 },
        { header: "Tồn kho", key: "stock", width: 10 },
        { header: "Dài (cm)", key: "length", width: 10 },
        { header: "Rộng (cm)", key: "width", width: 10 },
        { header: "Cao (cm)", key: "height", width: 10 },
        { header: "Chất liệu", key: "material", width: 20 },
        { header: "Khối lượng (kg)", key: "weight", width: 14 },
        { header: "Màu sắc", key: "color", width: 14 },
        { header: "TT Variant", key: "variant_status", width: 14 },
      ];

      const rows = [];
      const merges = [];
      const redCells = [];

      // Column index constants (1-indexed in Excel)
      const PRODUCT_COL_START = 1;
      const PRODUCT_COL_END = 7;
      const IMAGE_COL = 8;
      const VARIANT_COL_START = 9;
      const VARIANT_COL_END = 18;
      const STATUS_COL = 4;
      const VARIANT_STATUS_COL = 18;

      // currentRow tracks the Excel row (1-indexed, row 1 is header)
      let currentRow = 2;

      products.forEach((product) => {
        const images = product.variants?.images || [];
        const variantItems = product.variants?.variants || [];
        const totalRows = Math.max(images.length, variantItems.length, 1);

        const startRow = currentRow;

        // --- Step 1: Create empty row objects for this product ---
        const productRows = [];
        for (let i = 0; i < totalRows; i++) {
          productRows.push({});
        }

        // --- Step 2: Fill product-level fields (first row only) ---
        productRows[0].id = product.product_id;
        productRows[0].name = product.product_name;
        productRows[0].description = product.product_description || "";
        productRows[0].status = product.product_status || "";
        productRows[0].category = product.category_name || "";
        productRows[0].brand = product.brand_name || "";
        productRows[0].model3d = product.variants?.model3d || "";

        // --- Step 3: Distribute images across totalRows ---
        const imageSlots = distributeRows(images.length, totalRows);
        imageSlots.forEach((slot, idx) => {
          // Place image value in the first row of this slot
          productRows[slot.startOffset].image_url = images[idx];

          // Merge image column if this slot spans multiple rows
          if (slot.span > 1) {
            merges.push({
              top: startRow + slot.startOffset,
              left: IMAGE_COL,
              bottom: startRow + slot.startOffset + slot.span - 1,
              right: IMAGE_COL,
            });
          }
        });

        // If no images, merge the entire image column for this product
        if (images.length === 0 && totalRows > 1) {
          merges.push({
            top: startRow,
            left: IMAGE_COL,
            bottom: startRow + totalRows - 1,
            right: IMAGE_COL,
          });
        }

        // --- Step 4: Distribute variants across totalRows ---
        const variantSlots = distributeRows(variantItems.length, totalRows);
        variantSlots.forEach((slot, idx) => {
          const v = variantItems[idx];
          const targetRow = productRows[slot.startOffset];

          // Place variant values in the first row of this slot
          targetRow.sku = v.sku || "";
          targetRow.price = v.price || "";
          targetRow.stock = v.stock != null ? v.stock : "";
          targetRow.length = v.specs?.dimensions?.length || "";
          targetRow.width = v.specs?.dimensions?.width || "";
          targetRow.height = v.specs?.dimensions?.height || "";
          targetRow.material = v.specs?.material || "";
          targetRow.weight = v.specs?.weight || "";
          targetRow.color = v.specs?.color || "";
          targetRow.variant_status = v.status || "";

          // Red font for variant_status !== "available"
          if (v.status && v.status.toLowerCase() !== "available") {
            redCells.push({
              row: startRow + slot.startOffset,
              col: VARIANT_STATUS_COL,
            });
          }

          // Merge all variant columns if this slot spans multiple rows
          if (slot.span > 1) {
            for (let col = VARIANT_COL_START; col <= VARIANT_COL_END; col++) {
              merges.push({
                top: startRow + slot.startOffset,
                left: col,
                bottom: startRow + slot.startOffset + slot.span - 1,
                right: col,
              });
            }
          }
        });

        // If no variants, merge all variant columns for this product
        if (variantItems.length === 0 && totalRows > 1) {
          for (let col = VARIANT_COL_START; col <= VARIANT_COL_END; col++) {
            merges.push({
              top: startRow,
              left: col,
              bottom: startRow + totalRows - 1,
              right: col,
            });
          }
        }

        // --- Step 5: Red font for product status !== "AVAILABLE" ---
        if (
          product.product_status &&
          product.product_status.toUpperCase() !== "AVAILABLE"
        ) {
          redCells.push({ row: startRow, col: STATUS_COL });
        }

        // --- Step 6: Merge product-level columns if multiple rows ---
        if (totalRows > 1) {
          for (let col = PRODUCT_COL_START; col <= PRODUCT_COL_END; col++) {
            merges.push({
              top: startRow,
              left: col,
              bottom: startRow + totalRows - 1,
              right: col,
            });
          }
        }

        // --- Push all rows and advance currentRow ---
        productRows.forEach((r) => rows.push(r));
        currentRow += totalRows;
      });

      // --- Build file name with date ---
      const now = new Date();
      const dateStr = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("");
      const fileName = `San_pham_${dateStr}`;

      // --- Set export data for middleware ---
      res.locals.exportData = {
        fileName,
        sheetName: "Sản phẩm",
        columns,
        rows,
        merges,
        redCells,
      };

      next();
    } catch (error) {
      console.error("Export Products Format Error:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi chuẩn bị dữ liệu xuất" });
    }
  },

  /**
   * Prepare simplified order data for Excel export.
   * Joins order info with account email and user profile details.
   * One row per order (no item breakdown as requested).
   */
  formatOrders: async (req, res, next) => {
    try {
      const orders = await OrderModel.getAllForExport();

      // --- Column definitions ---
      const columns = [
        { header: "ID Đơn hàng", key: "id", width: 12 },
        { header: "Ngày đặt", key: "date", width: 20 },
        { header: "Trạng thái", key: "status", width: 16 },
        { header: "Tổng tiền", key: "total_price", width: 15 },
        { header: "Email khách hàng", key: "email", width: 25 },
        { header: "Tên khách hàng", key: "username", width: 20 },
        { header: "Số điện thoại", key: "phone_number", width: 15 },
        { header: "Địa chỉ giao hàng", key: "shipping_address", width: 40 },
        { header: "Ghi chú", key: "note", width: 30 },
      ];

      const rows = [];
      const redCells = [];

      // Column index for "Trạng thái" is 3
      const STATUS_COL = 3;

      orders.forEach((order, index) => {
        const rowIndex = index + 2; // +1 for header, +1 for 1-based index

        rows.push({
          id: `#${order.order_id}`,
          date: order.order_date
            ? new Date(order.order_date).toLocaleString("vi-VN")
            : "-",
          status: order.order_status,
          total_price: `${Number(order.total_price).toLocaleString("vi-VN")}đ`,
          email: order.email,
          username: order.username || "-",
          phone_number: order.phone_number || "-",
          shipping_address: order.shipping_address || "-",
          note: order.note || "-",
        });

        // Highlight CANCELLED status in Red & Bold
        if (order.order_status === "CANCELLED") {
          redCells.push({ row: rowIndex, col: STATUS_COL });
        }
      });

      // --- Build file name with date ---
      const now = new Date();
      const dateStr = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("");
      const fileName = `Don_hang_${dateStr}`;

      // --- Set export data for middleware ---
      res.locals.exportData = {
        fileName,
        sheetName: "Đơn hàng",
        columns,
        rows,
        merges: [],
        redCells,
      };

      next();
    } catch (error) {
      console.error("Export Orders Format Error:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi chuẩn bị dữ liệu xuất đơn hàng" });
    }
  },
};

export default ExportController;
