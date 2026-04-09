import ExcelJS from "exceljs";

/**
 * Generic Excel Export Middleware
 * 
 * Reads export configuration from `res.locals.exportData` and generates
 * a styled .xlsx file streamed directly to the client.
 * 
 * Expected shape of res.locals.exportData:
 * {
 *   fileName: string,          // e.g. "San_pham_20260404"
 *   sheetName: string,         // e.g. "Sản phẩm"
 *   columns: [                 // column definitions
 *     { header: string, key: string, width: number }
 *   ],
 *   rows: [                    // flat array of row objects keyed by column.key
 *     { id: 1, name: "...", ... }
 *   ],
 *   merges: [                  // optional array of merge ranges
 *     { top: number, left: number, bottom: number, right: number }
 *   ],
 *   redCells: [                // optional array of cells to color red
 *     { row: number, col: number }   // 1-indexed
 *   ]
 * }
 */
const exportExcel = async (req, res) => {
  try {
    const { fileName, sheetName, columns, rows, merges, redCells } =
      res.locals.exportData;

    // --- Create workbook & worksheet ---
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "FurnitureWeb Admin";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(sheetName || "Sheet1");

    // --- Set columns ---
    worksheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width || 15,
    }));

    // --- Style header row ---
    const headerRow = worksheet.getRow(1);
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1E3A5F" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "FFB0B0B0" } },
        left: { style: "thin", color: { argb: "FFB0B0B0" } },
        bottom: { style: "thin", color: { argb: "FFB0B0B0" } },
        right: { style: "thin", color: { argb: "FFB0B0B0" } },
      };
    });

    // --- Add data rows ---
    rows.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.border = {
          top: { style: "thin", color: { argb: "FFD0D0D0" } },
          left: { style: "thin", color: { argb: "FFD0D0D0" } },
          bottom: { style: "thin", color: { argb: "FFD0D0D0" } },
          right: { style: "thin", color: { argb: "FFD0D0D0" } },
        };
      });
    });

    // --- Apply merges ---
    if (merges && merges.length > 0) {
      merges.forEach((m) => {
        // ExcelJS mergeCells: top, left, bottom, right (1-indexed)
        worksheet.mergeCells(m.top, m.left, m.bottom, m.right);

        // Re-apply alignment for merged cells (center vertically)
        const mergedCell = worksheet.getCell(m.top, m.left);
        mergedCell.alignment = {
          vertical: "middle",
          horizontal: "left",
          wrapText: true,
        };
      });
    }

    // --- Apply red font for non-available statuses ---
    if (redCells && redCells.length > 0) {
      redCells.forEach(({ row, col }) => {
        const cell = worksheet.getCell(row, col);
        cell.font = {
          ...cell.font,
          color: { argb: "FFDC2626" },
          bold: true,
        };
      });
    }

    // --- Set response headers ---
    const safeFileName = `${fileName}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(safeFileName)}"`
    );

    // --- Stream workbook to response ---
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export Excel Error:", error);
    return res.status(500).json({ message: "Lỗi server khi xuất file Excel" });
  }
};

export default exportExcel;
