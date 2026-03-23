import { useMemo, useState } from "react";

const shippingFee = 0;
const assemblyFee = 200000;

export default function useCartPage(cartItems = []) {
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [assembly, setAssembly] = useState(true);
  
  const items = useMemo(
    () =>
      cartItems.map((it) => ({
        cart_item_id: it.cart_item_id,
        id: it.product_id,
        name: it.product_name,
        price: it.price || 0,
        color: it.color || "N/A",
        size: it.variant_ref || "N/A",
        qty: it.quantity,
        image: it.variants.images || "https://via.placeholder.com/300",
        deliveryText: "Hàng sẽ được giao trong vòng 5-7 ngày",
        material: it.material
      })),
    [cartItems],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items],
  );

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type === "percent") return Math.round((subtotal * coupon.value) / 100);
    if (coupon.type === "amount") return coupon.value;
    return 0;
  }, [coupon, subtotal]);

  const vat = useMemo(() => Math.round((subtotal - discount) * 0.1), [subtotal, discount]);

  const total = useMemo(() => {
    const service = assembly ? assemblyFee : 0;
    return Math.max(0, subtotal - discount + shippingFee + service + vat);
  }, [subtotal, discount, assembly, vat]);

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

  return {
    items,
    subtotal,
    discount,
    vat,
    total,
    shippingFee,
    assembly,
    setAssembly,
    couponInput,
    setCouponInput,
    applyCoupon,
    couponMsg,
    coupon,
  };
}
