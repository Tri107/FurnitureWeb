import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import ShippingForm from "@/components/ui/ShippingForm";
import PaymentMethod from "@/components/ui/PaymentMethod";
import CheckoutCart from "@/components/ui/CheckoutCart";
import PromoCode from "@/components/ui/PromoCode";
import OrderSummary from "@/components/ui/OrderSummary";

export default function Checkout() {


  // Same demo items as Cart for checkout
  const [items, setItems] = useState([
    {
      id: "p1",
      name: "Tủ cạnh nhiều ngăn (214cm)", // Text from the image: "Tủ cạnh nhiều ngăn (214cm)"
      price: 48362000,
      color: "Xanh hoàng hôn", // Text from the image: "Xanh hoàng hôn"
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    },
  ]);

  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState("");

  const shippingFee = 0; // "Miễn phí" in image

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type === "percent") return Math.round((subtotal * coupon.value) / 100);
    if (coupon.type === "amount") return coupon.value;
    return 0;
  }, [coupon, subtotal]);

  // The image "Tổng thanh toán" is Subtotal - discount + shippingFee
  // It doesn't show VAT explicitly as a separate line item before total like Cart, 
  // or maybe it's included. We will match the UI which just shows Subtotal, Shipping, Total.
  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + shippingFee);
  }, [subtotal, discount, shippingFee]);

  const updateQty = (id, nextQty) => {
    if (nextQty < 1) {
      alert("Số lượng sản phẩm tối thiểu là 1.");
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: nextQty } : it))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCoupon(null);
      setCouponMsg("");
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

  const handlePlaceOrder = () => {
    if (!shippingData.fullName || !shippingData.phone || !shippingData.address || !shippingData.city || !shippingData.district || !shippingData.ward) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }
    alert(`Đặt hàng thành công!\nPhương thức: ${paymentMethod}\nTổng tiền: ${total.toLocaleString("vi-VN")} VNĐ`);
    // Navigate home or clear cart
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link to="/cart" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Quay lại giỏ hàng
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Shipping & Payment */}
            <div className="lg:col-span-7">
              <ShippingForm formData={shippingData} setFormData={setShippingData} />
              <PaymentMethod method={paymentMethod} setMethod={setPaymentMethod} />
            </div>

            {/* Right Column: Cart, Promo, Summary */}
            <div className="lg:col-span-5">
              <CheckoutCart 
                items={items} 
                updateQty={updateQty} 
                removeItem={removeItem} 
              />
              <PromoCode 
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                applyCoupon={applyCoupon}
                couponMsg={couponMsg}
              />
              <OrderSummary 
                items={items}
                subtotal={subtotal}
                shippingFee={shippingFee}
                discount={discount}
                total={total}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
