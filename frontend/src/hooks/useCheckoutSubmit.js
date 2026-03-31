import { useState } from "react";
import toast from "react-hot-toast";
import { createOrder } from "@/lib/api";
import { clearCart } from "@/lib/cartApi";

export default function useCheckoutSubmit({
  cartItems,
  cart,
  shippingData,
  paymentMethod,
  navigate,
  optimisticClear,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!cartItems || cartItems.length === 0) {
      return false;
    }

    if (
      !shippingData.fullName.trim() ||
      !shippingData.phone.trim() ||
      !shippingData.address.trim() ||
      !shippingData.city.trim() ||
      !shippingData.district.trim() ||
      !shippingData.ward.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng.");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;

    if (!validate()) return;

    if (paymentMethod === "vnpay") {
      toast("Thanh toán VNPay đang được phát triển.");
      return;
    }

    try {
      setIsSubmitting(true);

      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Vui lòng đăng nhập để tiếp tục.");
        return;
      }

      const user = JSON.parse(userStr);

      const fullAddress = `${shippingData.address}, ${shippingData.ward}, ${shippingData.district}, ${shippingData.city}`;

      const orderNote = `Người nhận: ${shippingData.fullName.trim()} - SĐT: ${shippingData.phone.trim()}. Ghi chú: ${(shippingData.note || "").trim()}`;

      const mappedItems = cartItems.map((item) => ({
        product_id: item.product_id,
        sku: item.sku,
        quantity: item.quantity,
      }));

      const payload = {
        account_id: user.id,
        total_price: cart.total,
        address: fullAddress,
        note: orderNote,
        discount_id: null,
        items: mappedItems,
      };

      await createOrder(payload);

      optimisticClear();
      await clearCart();

      toast.success("Đặt hàng thành công");

      navigate("/order-success", {
        state: {
          total: cart.total,
          address: fullAddress,
          paymentMethod: "cod",
        },
      });
    } catch (error) {
      toast.error(error.message || "Lỗi khi đặt hàng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handlePlaceOrder,
    isSubmitting,
  };
}
