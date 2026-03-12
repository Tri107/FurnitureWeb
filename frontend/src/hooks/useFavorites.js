/* Hook quản lý logic wishlist */

import { useState } from "react";

export default function useFavorites() {
  const [favorites, setFavorites] = useState([
    {
      id: "p1",
      name: "Sofa Vải Nỉ Bắc Âu",
      price: 8500000,
      oldPrice: 10500000,
      tag: "Mới",
      rating: 5,
      reviews: 24,
      img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80&auto=format&fit=crop",
    },
    {
      id: "p2",
      name: "Bàn Trà Gỗ Sồi Tự Nhiên",
      price: 2800000,
      oldPrice: 3200000,
      tag: "-12%",
      rating: 4,
      reviews: 12,
      img: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=1200&q=80&auto=format&fit=crop",
    },
  ]);

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const addToCart = (product) => {
    alert(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return {
    favorites,
    removeFavorite,
    clearFavorites,
    addToCart,
  };
}
