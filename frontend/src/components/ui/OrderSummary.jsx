import React from "react";

export default function OrderSummary({ items, subtotal, shippingFee, discount, total, onPlaceOrder }) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white">
      <h2 className="text-lg font-bold text-slate-900 mb-5">Tóm tắt đơn hàng</h2>
      
      <div className="space-y-4 mb-6">
        {/* Item summary list */}
        {items.map(item => (
          <div key={item.id} className="text-slate-600 text-sm">
            {item.qty}x {item.name.split(' (')[0]}
          </div>
        ))}

        <div className="flex justify-between items-center text-slate-600 text-sm mt-4">
          <span>Tổng tiền hàng</span>
          <span className="font-medium text-slate-900">{subtotal.toLocaleString("vi-VN")}VNĐ</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-slate-600 text-sm">
            <span>Giảm giá</span>
            <span className="font-medium text-green-600">-{discount.toLocaleString("vi-VN")}VNĐ</span>
          </div>
        )}

        <div className="flex justify-between items-center text-slate-600 text-sm">
          <span>Phí vận chuyển</span>
          <span className="font-medium text-slate-900">
            {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}VNĐ`}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-red-500">Tổng thanh toán</span>
        <span className="font-bold text-red-500 text-lg">{total.toLocaleString("vi-VN")}VNĐ</span>
      </div>

      <button
        onClick={onPlaceOrder}
        className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-center"
      >
        Đặt hàng
      </button>
    </div>
  );
}
