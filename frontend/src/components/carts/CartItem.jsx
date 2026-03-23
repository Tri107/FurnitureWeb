import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="p-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="aspect-[4/3] overflow-hidden rounded-sm bg-slate-100">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{item.name}</h2>
                <div className="mt-3 space-y-2 text-base text-slate-600">
                  <p>
                    Màu sắc : <span className="text-slate-800">{item.color}</span>
                  </p>
                  <p>Chất liệu: {item.material}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-[5px]">
                <button
                  onClick={() => onUpdate(item.cart_item_id, item.qty - 1)}
                  className="h-11 w-11 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-50"
                  aria-label="Giảm số lượng"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="w-7 text-center text-base font-semibold text-slate-900">{item.qty}</span>

                <button
                  onClick={() => onUpdate(item.cart_item_id, item.qty + 1)}
                  className="h-11 w-11 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-50"
                  aria-label="Tăng số lượng"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <p className="flex h-11 items-center text-[22px] font-normal text-red-600">
                {item.totalPrice}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 h-px w-full bg-slate-200" />

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm md:text-[15px] text-slate-700">{item.deliveryText}</p>

          <div className="flex items-center gap-8 text-sm md:text-[15px] text-slate-600">
            <button
              type="button"
              onClick={() => onRemove(item.cart_item_id)}
              className="flex items-center gap-2 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Xóa sản phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
