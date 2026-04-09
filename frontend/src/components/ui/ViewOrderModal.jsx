import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { getOrderById } from "../../lib/api";
import { format } from "date-fns";

const statusColors = {
  PENDING: "bg-yellow-400 text-white",
  DELIVERING: "bg-blue-400 text-white",
  DELIVERED: "bg-green-400 text-white",
  CANCELLED: "bg-red-400 text-white",
};

const statusLabels = {
  PENDING: "Chờ xử lý",
  DELIVERING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

export default function ViewOrderModal({ open, onClose, orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error("Load order failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [open, orderId]);
  // Helper calculations
  let subTotal = 0;
  let discountValue = 0;
  let extraInfo = {};
  let displayNote = order ? order.note || "" : "";
  
  if (order) {
    // Tách thông tin phí từ ghi chú nếu có
    if (order.note && order.note.includes("###FEES###")) {
      const parts = order.note.split(" ###FEES###");
      displayNote = parts[0];
      try {
        extraInfo = JSON.parse(parts[1]);
      } catch (e) {
        console.error("Error parsing fees from note:", e);
      }
    }

    if (order.items) {
      subTotal = order.items.reduce((sum, item) => {
        const snapshot = typeof item.variant_snapshot === 'string'
          ? JSON.parse(item.variant_snapshot)
          : (item.variant_snapshot || {});
        return sum + (Number(snapshot.price || 0) * item.quantity);
      }, 0);
    }

    // Tính tiền giảm dựa trên tổng đơn hàng (Tạm tính + Phí + Thuế) và % giảm giá
    if (order.discount_percentage) {
      const baseTotal = subTotal + (Number(extraInfo.vat) || 0) + (Number(extraInfo.assemblyFee) || 0) + (Number(extraInfo.shippingFee) || 0);
      discountValue = Math.round((baseTotal * Number(order.discount_percentage)) / 100);
    } else if (order.discount_code && subTotal > order.total_price) {
      const baseTotal = subTotal + (Number(extraInfo.vat) || 0) + (Number(extraInfo.assemblyFee) || 0) + (Number(extraInfo.shippingFee) || 0);
      discountValue = baseTotal - Number(order.total_price);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>Chi tiết đơn hàng #{orderId}</span>
            {order && (
              <Badge className={`${statusColors[order.order_status]} px-3 py-1 rounded-full border-none`}>
                {statusLabels[order.order_status]}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[75vh] pr-4 mt-4">
          <div className="space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                <p className="text-sm text-muted-foreground">Đang tải thông tin đơn hàng...</p>
              </div>
            ) : order ? (
              <>
                {/* Order Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Khách hàng</Label>
                      <p className="font-semibold text-lg">{order.username || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                      <p className="text-sm text-muted-foreground">{order.phone_number || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Ngày đặt hàng</Label>
                      <p className="font-medium">
                        {order.order_date ? format(new Date(order.order_date), "HH:mm, dd/MM/yyyy") : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Địa chỉ giao hàng</Label>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg border italic">
                        {order.address || "Chưa cung cấp"}
                      </p>
                    </div>
                    {displayNote && (
                      <div>
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Ghi chú</Label>
                        <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-100 italic">
                          {displayNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="opacity-50" />

                {/* Items Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    Sản phẩm trong đơn hàng
                    <Badge variant="outline" className="ml-2">{order.items?.length || 0}</Badge>
                  </h3>
                  <div className="border rounded-xl shadow-sm overflow-hidden bg-white">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 border-b text-left">
                        <tr>
                          <th className="px-4 py-3 font-medium">Sản phẩm</th>
                          <th className="px-4 py-3 font-medium text-center">Số lượng</th>
                          <th className="px-4 py-3 font-medium text-right">Đơn giá</th>
                          <th className="px-4 py-3 font-medium text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {order.items?.map((item, idx) => {
                          const snapshot = typeof item.variant_snapshot === 'string'
                            ? JSON.parse(item.variant_snapshot)
                            : (item.variant_snapshot || {});
                          return (
                            <tr key={idx} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <p className="font-bold text-sm leading-tight">{item.product_name}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">SKU: {snapshot.sku || "N/A"}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center font-medium">x{item.quantity}</td>
                              <td className="px-4 py-4 text-right font-medium">
                                {Number(snapshot.price || 0).toLocaleString("vi-VN")}đ
                              </td>
                              <td className="px-4 py-4 text-right font-bold text-blue-600">
                                {Number((snapshot.price || 0) * item.quantity).toLocaleString("vi-VN")}đ
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-muted/5 font-bold border-t">
                        <tr>
                          <td colSpan="3" className="px-4 py-3 text-right text-muted-foreground font-medium">Tạm tính</td>
                          <td className="px-4 py-3 text-right">
                            {Number(subTotal).toLocaleString("vi-VN")}đ
                          </td>
                        </tr>
                        {extraInfo.vat > 0 && (
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-right text-muted-foreground font-medium border-t border-dashed">Thuế VAT (10%)</td>
                            <td className="px-4 py-3 text-right text-slate-700 border-t border-dashed">
                              {Number(extraInfo.vat).toLocaleString("vi-VN")}đ
                            </td>
                          </tr>
                        )}
                        {extraInfo.assemblyFee > 0 && (
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-right text-muted-foreground font-medium border-t border-dashed">Phí lắp ráp</td>
                            <td className="px-4 py-3 text-right text-slate-700 border-t border-dashed">
                              {Number(extraInfo.assemblyFee).toLocaleString("vi-VN")}đ
                            </td>
                          </tr>
                        )}
                        {extraInfo.shippingFee > 0 && (
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-right text-muted-foreground font-medium border-t border-dashed">Phí vận chuyển</td>
                            <td className="px-4 py-3 text-right text-slate-700 border-t border-dashed">
                              {Number(extraInfo.shippingFee).toLocaleString("vi-VN")}đ
                            </td>
                          </tr>
                        )}
                        {!!order.discount_code && (
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-right text-muted-foreground font-medium border-t border-dashed">
                              <div className="flex items-center justify-end gap-2">
                                Giảm giá
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-red-500 border-t border-dashed">
                              -{Number(discountValue).toLocaleString("vi-VN")}đ
                            </td>
                          </tr>
                        )}
                        <tr className="border-t text-lg bg-muted/10">
                          <td colSpan="3" className="px-4 py-4 text-right">Tổng cộng</td>
                          <td className="px-4 py-4 text-right text-blue-600">
                            {Number(order.total_price).toLocaleString("vi-VN")}đ
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-muted-foreground">
                Không tìm thấy thông tin chi tiết đơn hàng.
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
