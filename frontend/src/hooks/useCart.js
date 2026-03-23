import { useEffect, useState } from "react";
import { getCart } from "../lib/cartApi";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data.data || data);
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cartItems,
    setCartItems,
    loading,
    refetch: fetchCart,
  };
};
