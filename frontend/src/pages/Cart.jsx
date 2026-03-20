import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCart } from "@/hooks/useCart";
import { useCartActions } from "@/hooks/useCartActions";

import {
  Heart,
  Trash2,
  Minus,
  Plus,
  RefreshCcw,
  ShieldCheck,
  CreditCard,
  Truck,
} from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, loading, refetch } = useCart();
  const { handleUpdateQuantity, handleRemove } = useCartActions(refetch);

  // map data cho đúng UI
  const items = cartItems.map((it) => ({
    cart_item_id: it.cart_item_id,
    id: it.product_id,
    name: it.product_name,
    price: it.price || 0,
    color: "N/A", // nếu chưa có variant
    size: it.variant_ref || "N/A",
    qty: it.quantity,
    image: it.image || "https://via.placeholder.com/300",
    deliveryText: "Hàng sẽ được giao trong vòng 5-7 ngày",
  }));

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState("");

  const shippingFee = 0;
  const assemblyFee = 200000;
  const [assembly, setAssembly] = useState(true);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items],
  );

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type === "percent")
      return Math.round((subtotal * coupon.value) / 100);
    if (coupon.type === "amount") return coupon.value;
    return 0;
  }, [coupon, subtotal]);

  const vat = useMemo(() => {
    return Math.round((subtotal - discount) * 0.1);
  }, [subtotal, discount]);

  const total = useMemo(() => {
    const service = assembly ? assemblyFee : 0;
    return Math.max(0, subtotal - discount + shippingFee + service + vat);
  }, [subtotal, discount, shippingFee, assembly, vat]);

  const updateQty = (id, nextQty) => {
    if (nextQty < 1) {
      alert("Số lượng sản phẩm tối thiểu là 1.");
      return;
    }

    handleUpdateQuantity(id, nextQty);
  };

  const removeItem = (id) => {
    handleRemove(id);
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCoupon(null);
      setCouponMsg("Vui lòng nhập mã giảm giá.");
      return;
    }

    if (code === "GIAM10") {
      setCoupon({ code, type: "percent", value: 10 });
      setCouponMsg("Đã áp dụng mã GIAM10.");
      return;
    }

    if (code === "GIAM200K") {
      setCoupon({ code, type: "amount", value: 200000 });
      setCouponMsg("Đã áp dụng mã GIAM200K.");
      return;
    }

    setCoupon(null);
    setCouponMsg("Mã không hợp lệ hoặc đã hết hạn.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Giỏ hàng của bạn
          </h1>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {items.length === 0 ? (
                <Card className="rounded-md border-slate-200 shadow-sm">
                  <CardContent className="p-10 text-center text-slate-600">
                    Giỏ hàng đang trống.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-5">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="rounded-md border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="p-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                          <div className="md:col-span-4">
                            <div className="aspect-[4/3] overflow-hidden rounded-sm bg-slate-100">
                              <img
                                src={it.image}
                                alt={it.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-8">
                            <div>
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h2 className="text-xl font-semibold text-slate-900">
                                    {it.name}
                                  </h2>

                                  <div className="mt-3 space-y-2 text-base text-slate-600">
                                    <p>
                                      Màu sắc :{" "}
                                      <span className="text-slate-800">
                                        {it.color}
                                      </span>
                                    </p>
                                    <p>Kích thước: {it.size}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-[5px]">
                                  <button
                                    onClick={() => updateQty(it.cart_item_id, it.qty - 1)}
                                    className="h-11 w-11 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-50"
                                    aria-label="Giảm số lượng"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>

                                  <span className="w-7 text-center text-base font-semibold text-slate-900">
                                    {it.qty}
                                  </span>

                                  <button
                                    onClick={() => updateQty(it.cart_item_id, it.qty + 1)}
                                    className="h-11 w-11 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-50"
                                    aria-label="Tăng số lượng"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>

                                <p className="flex h-11 items-center text-[22px] font-normal text-red-600">
                                  {formatVND(it.price * it.qty)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 h-px w-full bg-slate-200" />

                        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <p className="text-sm md:text-[15px] text-slate-700">
                            {it.deliveryText}
                          </p>

                          <div className="flex items-center gap-8 text-sm md:text-[15px] text-slate-600">
                            {/* <button
                              type="button"
                              onClick={() => alert("Đã thêm vào Yêu thích (demo)")}
                              className="flex items-center gap-2 hover:text-slate-900"
                            >
                              <Heart className="h-4 w-4" />
                              Yêu Thích
                            </button> */}

                            <button
                              type="button"
                              onClick={() => removeItem(it.cart_item_id)}
                              className="flex items-center gap-2 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Xóa sản phẩm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <Card className="rounded-md border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tóm tắt đơn hàng</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-5 pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Tạm tính</span>
                      <span>{formatVND(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex items-center justify-between text-slate-700">
                        <span>Ưu đãi ({coupon?.code})</span>
                        <span className="text-red-600">
                          - {formatVND(discount)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-700">
                      <span>Vận chuyển</span>
                      <span>
                        {shippingFee === 0
                          ? "Miễn phí"
                          : formatVND(shippingFee)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-700">
                      <span>VAT (10%)</span>
                      <span>{formatVND(vat)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex overflow-hidden rounded-full border border-slate-200 bg-white">
                      <Input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Nhập mã giảm giá"
                        className="h-10 border-0 rounded-none shadow-none focus-visible:ring-0"
                      />
                      <Button
                        className="h-10 rounded-none rounded-r-full bg-red-600 px-5 hover:bg-red-700"
                        onClick={applyCoupon}
                      >
                        Áp Dụng
                      </Button>
                    </div>

                    {couponMsg ? (
                      <p className="mt-2 text-xs text-slate-600">{couponMsg}</p>
                    ) : null}
                  </div>

                  <div className="h-px w-full bg-slate-200" />

                  <label className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={assembly}
                        onChange={(e) => setAssembly(e.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 accent-red-600"
                      />

                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <span>Dịch vụ lắp ráp</span>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            -50%
                          </span>
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          Chúng tôi sẽ giao hàng và lắp ráp đồ nội thất cho bạn
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-sm font-semibold text-red-600">
                      {assembly ? formatVND(assemblyFee) : formatVND(0)}
                    </div>
                  </label>

                  <div className="h-px w-full bg-slate-200" />

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-normal text-slate-900">
                      Tổng Tiền
                    </p>
                    <p className="text-[20px] font-bold text-red-600">
                      {formatVND(total)}
                    </p>
                  </div>

                  <Button
                    className="h-12 w-full rounded-full bg-red-600 text-base hover:bg-red-700"
                    disabled={items.length === 0}
                    onClick={() => navigate("/checkout")}
                  >
                    Thanh toán
                  </Button>

                  <div className="h-px w-full bg-slate-200" />

                  <div className="pt-1 space-y-3 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <RefreshCcw className="h-4 w-4 text-slate-500" />
                      Đổi trả miễn phí trong 7 ngày
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-slate-500" />
                      Bao gồm bảo hành 6 tháng
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-slate-500" />
                      Thanh toán nhanh chóng và an toàn
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-slate-500" />
                      Giao hàng tận nhà
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function formatVND(v) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v);
}
