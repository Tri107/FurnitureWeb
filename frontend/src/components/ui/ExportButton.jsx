import { useState } from "react";
import { Button } from "./button";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Reusable Export to Excel Button Component
 * 
 * @param {Function} onExport - API function that returns a blob (e.g., exportProducts, exportOrders)
 * @param {string} fileNamePrefix - Prefix for the filename (e.g., "San_pham", "Don_hang")
 * @param {string} label - Button label (default: "Xuất Excel")
 * @param {string} className - Additional CSS classes
 */
const ExportButton = ({ 
  onExport, 
  fileNamePrefix = "Export", 
  label = "Xuất Excel", 
  className = "" 
}) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await onExport();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      // format: Prefix_YYYYMMDD.xlsx
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      a.download = `${fileNamePrefix}_${dateStr}.xlsx`;
      
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Xuất file ${label} thành công!`);
    } catch (err) {
      console.error("Export failed", err);
      toast.error("Xuất file thất bại! Vui lòng thử lại sau.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      className={`bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 px-6 shadow-sm transition-all ${className}`}
      disabled={exporting}
      onClick={handleExport}
    >
      <Download size={18} />
      {exporting ? "Đang xuất..." : label}
    </Button>
  );
};

export default ExportButton;
