import { useState, useEffect } from "react";
import useFavoriteActions from "@/hooks/useFavoriteActions";
import { getFavorites } from "@/lib/api";

export default function FavoriteButton({ productId }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const { toggleFavorite } = useFavoriteActions();

  const [liked, setLiked] = useState(false);

  // load trạng thái favorite ban đầu
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const data = await getFavorites(user.id);

        const isFavorite = data.some((p) => p.product_id === productId);

        setLiked(isFavorite);
      } catch (err) {
        console.error("Load favorite error", err);
      }
    };

    fetchFavorites();
  }, [productId]);

  const handleClick = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập");
      return;
    }

    try {
      await toggleFavorite(productId, user.id);

      // đổi trạng thái icon
      setLiked((prev) => !prev);
    } catch (err) {
      console.error("Favorite error", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute top-2 right-2 w-7 h-7 rounded-full 
      flex items-center justify-center text-sm
      ${liked ? "bg-red-500 text-white" : "bg-white/80 text-slate-700"}
      hover:scale-110 transition`}
    >
      ♥
    </button>
  );
}