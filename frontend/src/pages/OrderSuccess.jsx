import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state || {};

  const total = state.total || 0;
  const address = state.address || "";
  const paymentMethod = state.paymentMethod || "cod";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-sm border border-slate-200 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Đặt hàng thành công
          </h1>

          <p className="text-slate-600 mb-6">
            Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được tạo thành công.
          </p>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-left space-y-3 mb-6">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Phương thức thanh toán</span>
              <span className="font-medium text-slate-900">
                {paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng"
                  : paymentMethod}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Tổng thanh toán</span>
              <span className="font-medium text-red-600">
                {Number(total).toLocaleString("vi-VN")}VNĐ
              </span>
            </div>

            <div className="flex justify-between gap-4 items-start">
              <span className="text-slate-500">Địa chỉ giao hàng</span>
              <span className="font-medium text-slate-900 text-right max-w-[65%]">
                {address || "Không có thông tin"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-white font-semibold hover:bg-red-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>

            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Về giỏ hàng
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
