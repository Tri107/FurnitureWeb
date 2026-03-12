import { useState, useMemo } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

import FavoriteCard from "@/components/favorites/FavoriteCard";
import FavoritesHeader from "@/components/favorites/FavoritesHeader";
import FavoritesEmpty from "@/components/favorites/FavoritesEmpty";

import useFavorites from "@/hooks/useFavorites";

export default function Favorites() {
  // Lấy dữ liệu và các function xử lý từ custom hook
  const { favorites, removeFavorite, clearFavorites, addToCart } =
    useFavorites();

  // state lưu trạng thái sắp xếp sản phẩm
  const [sort, setSort] = useState("default");

  const sortedFavorites = useMemo(() => {
    if (sort === "low") return [...favorites].sort((a, b) => a.price - b.price);

    if (sort === "high")
      return [...favorites].sort((a, b) => b.price - a.price);

    return favorites;
  }, [favorites, sort]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 bg-slate-50">
        {/* Header của trang Favorites
           chứa tiêu đề, sort dropdown và nút xóa tất cả */}
        <FavoritesHeader
          count={favorites.length}
          sort={sort}
          setSort={setSort}
          clearFavorites={clearFavorites}
        />

        {/* Hiển thị sản phẩm */}
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4">
            {/* Nếu chưa có sản phẩm yêu thích */}
            {favorites.length === 0 ? (
              <FavoritesEmpty />
            ) : (
              // grid hiển thị danh sách sản phẩm
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {sortedFavorites.map((p) => (
                  <FavoriteCard
                    key={p.id}
                    product={p}
                    removeFavorite={removeFavorite}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
