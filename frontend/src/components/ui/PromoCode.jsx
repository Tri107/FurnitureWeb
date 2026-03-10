import React from "react";
import { Ticket } from "lucide-react";

export default function PromoCode({ couponInput, setCouponInput, applyCoupon, couponMsg }) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white mb-6">
      <h2 className="text-lg font-bold text-slate-900 mb-5">Mã khuyến mãi</h2>
      <div className="space-y-3">
        {/* Chọn mã button/box */}
        <button className="w-full flex items-center px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium">
          <Ticket className="w-5 h-5 mr-2 text-slate-500" />
          Chọn mã
        </button>

        {/* Nhập mã và Áp dụng */}
        <div className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Nhập mã khuyến mãi"
            className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-800 transition-colors"
          />
          <button
            onClick={applyCoupon}
            className="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Áp dụng
          </button>
        </div>
        {couponMsg && (
          <p className={`text-sm mt-2 ${couponMsg.includes("thành công") || couponMsg.includes("Đã áp dụng") ? "text-green-600" : "text-red-500"}`}>
            {couponMsg}
          </p>
        )}
      </div>
    </div>
  );
}
