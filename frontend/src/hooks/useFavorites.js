import { useState, useEffect } from "react";
import { getFavorites } from "@/lib/favoriteApi";

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) return;

        const data = await getFavorites(user.id);

        // map dữ liệu API → UI
        const mapped = data.map((p) => ({
          id: p.product_id,
          name: p.product_name,
          description: p.product_description,
          price: 1000000,
          oldPrice: null,
          rating: 4,
          reviews: 10,
          img: "https://picsum.photos/400/300",
        }));

        setFavorites(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = (productId) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const addToCart = (product) => {
    alert(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return {
    favorites,
    loading,
    error,
    removeFavorite,
    clearFavorites,
    addToCart,
  };
}