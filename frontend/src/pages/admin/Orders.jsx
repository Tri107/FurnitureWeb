import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import ViewOrderModal from "../../components/ui/ViewOrderModal";
import ExportButton from "../../components/ui/ExportButton";
import { getOrders, updateOrderStatus, exportOrders } from "../../lib/api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

const statusColors = {
  PENDING: "bg-yellow-400",
  DELIVERING: "bg-blue-400",
  DELIVERED: "bg-green-400",
  CANCELLED: "bg-red-400",
};

const statusLabels = {
  PENDING: "Chờ xử lý",
  DELIVERING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

// Memoized Row Component
const OrderRow = React.memo(({ item, onUpdateStatus, onViewDetails }) => {
  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/20">
      <td className="px-6 py-4 font-medium">#{item.order_id}</td>

      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium">{item.email}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        {item.order_date ? format(new Date(item.order_date), "dd/MM/yyyy HH:mm") : "-"}
      </td>

      <td className="px-6 py-4 font-bold text-blue-600">
        {Number(item.total_price).toLocaleString("vi-VN")}đ
      </td>

      <td className="px-6 py-4 ">
        <div className="flex items-center justify-center">
          <Select
            value={item.order_status}
            onValueChange={(value) => onUpdateStatus(item.order_id, value)}
          >
            <SelectTrigger className="w-[140px] bg-white border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusColors[item.order_status].split(' ')[0]}`} />
                <span className="text-xs font-medium">{statusLabels[item.order_status]}</span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white">
              {Object.keys(statusLabels).map((status) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[status].split(' ')[0]}`} />
                    <span>{statusLabels[status]}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 hover:bg-blue-50"
            onClick={() => onViewDetails(item.order_id)}
          >
            <Eye size={14} />
            Chi tiết
          </Button>
        </div>
      </td>
    </tr>
  );
});

OrderRow.displayName = "OrderRow";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [viewOrderId, setViewOrderId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // For Cursor Pagination
  const [cursorHistory, setCursorHistory] = useState([null]);
  const [pageIndex, setPageIndex] = useState(0);

  // Reset pagination on search change
  useEffect(() => {
    setCursorHistory([null]);
    setPageIndex(0);
  }, [search]);

  const currentCursor = cursorHistory[pageIndex];

  const {
    data,
    isLoading,
    isError,
    isFetching
  } = useQuery({
    queryKey: ['orders', search, currentCursor],
    queryFn: async () => {
      const res = await getOrders({ cursor: currentCursor, limit: 15, search });
      return res; 
    },
    placeholderData: keepPreviousData,
  });

  const orders = useMemo(() => data?.data || [], [data]);
  const nextCursor = data?.nextCursor;

  const handleNextPage = () => {
    if (nextCursor) {
      if (pageIndex === cursorHistory.length - 1) {
        setCursorHistory((prev) => [...prev, nextCursor]);
      }
      setPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  };

  const handleUpdateStatus = useCallback(async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      toast.success("Cập nhật trạng thái thành công");
      
      queryClient.setQueryData(['orders', search, currentCursor], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((o) => 
            o.order_id === orderId ? { ...o, order_status: newStatus } : o
          ),
        };
      });
    } catch (err) {
      console.error("Update status failed", err);
      toast.error("Cập nhật trạng thái thất bại");
    }
  }, [queryClient, search, currentCursor]);

  const handleViewDetails = useCallback((id) => {
    setViewOrderId(id);
    setIsViewModalOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 ">
          <div className="rounded-xl shrink-0 border border-slate-200 bg-white shadow-sm px-4 py-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <ShoppingBag size={16} />
            </div>
            <div className="flex items-center gap-2 pr-1">
              <p className="text-sm text-muted-foreground font-medium">Trạng thái:</p>
              <p className="text-md font-medium text-slate-900 leading-none">
                 {isFetching ? "Đang tải dữ liệu..." : "Hoàn tất"}
              </p>
            </div>
          </div>
          <ExportButton onExport={exportOrders} fileNamePrefix="Don_hang" />
        </div>

        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm theo email hoặc ID..."
            className="pl-9 bg-white border-slate-200 focus:ring-blue-500/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-2xl overflow-hidden border-slate-200 shadow-sm relative">
        {isFetching && (
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-100">
              <div className="h-full bg-blue-600 animate-pulse w-1/3 rounded-r-md"></div>
            </div>
        )}
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr className="text-left text-slate-500 uppercase text-[11px] tracking-wider">
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Khách hàng</th>
                  <th className="px-6 py-3 font-semibold">Ngày đặt</th>
                  <th className="px-6 py-3 font-semibold text-left">Tổng tiền</th>
                  <th className="px-6 py-3 font-semibold text-center">Trạng thái</th>
                  <th className="px-6 py-3 text-right font-semibold">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                        <span>Đang khởi tạo...</span>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-red-500">
                      Lỗi tải dữ liệu. Vui lòng thử lại.
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((item) => (
                    <OrderRow
                      key={item.order_id}
                      item={item}
                      onUpdateStatus={handleUpdateStatus}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="p-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
            <span className="text-sm text-slate-500">
               Trang {pageIndex + 1}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrevPage} 
                disabled={pageIndex === 0 || isFetching}
              >
                <ChevronLeft size={16} className="mr-1" />
                Trang trước
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNextPage} 
                disabled={!nextCursor || isFetching}
              >
                Trang sau
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ViewOrderModal
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewOrderId(null);
        }}
        orderId={viewOrderId}
      />
    </div>
  );
}
