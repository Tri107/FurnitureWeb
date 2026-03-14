/* Card sản phẩm */

import { formatVND } from "../../lib/utils";

export default function FavoriteCard({ product, removeFavorite, addToCart }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 overflow-hidden hover:shadow-md transition">
      {/* IMAGE */}
      <div className="relative">
        <div className="aspect-[4/3] bg-slate-100">
          <img
            src={product.img}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {product.tag && (
          <span className="absolute top-2 left-2 rounded bg-black/70 px-2 py-1 text-[10px] text-white">
            {product.tag}
          </span>
        )}

        <button
          onClick={() => removeFavorite(product.id)}
          className="absolute top-2 right-2 bg-white/90 rounded-full w-6 h-6 text-xs hover:bg-red-100"
        >
          ✕
        </button>
      </div>

      {/* INFO */}
      <div className="p-3">
        <p className="text-[12px] font-semibold text-slate-900 line-clamp-2 min-h-[32px]">
          {product.name}
        </p>

        {/* RATING */}
        <div className="mt-1 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={
                i < (product.rating ?? 0)
                  ? "text-yellow-400 text-[10px]"
                  : "text-slate-300 text-[10px]"
              }
            >
              ★
            </span>
          ))}

          <span className="text-[11px] text-slate-500 ml-1">
            ({product.reviews ?? 0})
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-[12px] font-bold text-slate-900">
              {formatVND(product.price)}
            </p>

            {product.oldPrice && (
              <p className="text-[11px] text-slate-400 line-through">
                {formatVND(product.oldPrice)}
              </p>
            )}
          </div>

          <div className="flex gap-1">
            <button className="text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
              Xem
            </button>

            <button
              onClick={() => addToCart(product)}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
