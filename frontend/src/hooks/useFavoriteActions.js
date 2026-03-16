import { addFavorite } from "@/lib/api";

export default function useFavoriteActions() {
  const toggleFavorite = async (productId, userId) => {
    try {
      
      await addFavorite(userId, productId);
    } catch (err) {
      console.error("Favorite error", err);
    }
  };

  return { toggleFavorite };
}
