import { useEffect } from "react";
import toast from "react-hot-toast";

export default function useCheckoutGuard(cartItems, navigate) {
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Giỏ hàng đang trống.");
      navigate("/cart");
    }
  }, [cartItems, navigate]);
}
