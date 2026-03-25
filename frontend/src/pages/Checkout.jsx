import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import ShippingForm from "@/components/ui/ShippingForm";
import PaymentMethod from "@/components/ui/PaymentMethod";
import CheckoutCart from "@/components/ui/CheckoutCart";
import PromoCode from "@/components/ui/PromoCode";
import OrderSummary from "@/components/ui/OrderSummary";
import { useCart } from "@/hooks/useCart";
import useCartPage from "@/hooks/useCartPage";
import { getMyProfile, createOrder } from "@/lib/api";
import { clearCart } from "@/lib/cartApi";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, optimisticClear } = useCart();
  const cart = useCartPage(cartItems);
  const items = cart.items;

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return; // User not logged in?
        const result = await getMyProfile();
        if (result && result.data) {
          setShippingData(prev => ({
            ...prev,
            fullName: result.data.username || "",
            phone: result.data.phone_number || "",
            email: result.data.email || ""
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile info", err);
      }
    };
    fetchProfile();
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const handlePlaceOrder = async () => {
    if (!shippingData.fullName || !shippingData.phone || !shippingData.address || !shippingData.city || !shippingData.district || !shippingData.ward) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }
    
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Vui lòng đăng nhập để tiếp tục.");
        return;
      }
      const user = JSON.parse(userStr);
      
      const fullAddress = `${shippingData.address}, ${shippingData.ward}, ${shippingData.district}, ${shippingData.city}`;
      const mappedItems = items.map(it => ({
        product_id: it.id,
        sku: it.sku,
        quantity: it.qty
      }));

      const payload = {
        account_id: user.id,
        total_price: cart.total,
        address: fullAddress,
        note: shippingData.note,
        items: mappedItems
      };

      await createOrder(payload);
      
      toast.success("Đặt hàng thành công");
      optimisticClear();
      await clearCart();
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Lỗi khi đặt hàng");
    }
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
              />
              <PromoCode
                couponInput={cart.couponInput}
                setCouponInput={cart.setCouponInput}
                applyCoupon={cart.applyCoupon}
                couponMsg={cart.couponMsg}
              />
              <OrderSummary
                items={items}
                subtotal={cart.subtotal}
                shippingFee={cart.shippingFee}
                discount={cart.discount}
                total={cart.total}
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
