import { useMemo, useState, useEffect } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function Home() {
  const categories = useMemo(
    () => [
      {
        id: "living",
        name: "Phòng Khách",
        count: "123+ sản phẩm",
        img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "bedroom",
        name: "Phòng Ngủ",
        count: "95+ sản phẩm",
        img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "dining",
        name: "Phòng Ăn",
        count: "60+ sản phẩm",
        img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "decor",
        name: "Đồ Trang Trí",
        count: "80+ sản phẩm",
        img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&q=80&auto=format&fit=crop",
      },
    ],
    []
  );

  const products = useMemo(
    () => [
      {
        id: "p1",
        name: "Sofa Vải Nỉ Bắc Âu",
        price: 8500000,
        oldPrice: 10500000,
        tag: "Mới",
        type: "new",
        rating: 5,
        reviews: 24,
        img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "p2",
        name: "Ghế Armchair Dạ Thật",
        price: 4200000,
        oldPrice: null,
        tag: "Hot",
        type: "best",
        rating: 5,
        reviews: 18,
        img: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "p3",
        name: "Bàn Trà Gỗ Sồi Tự Nhiên",
        price: 2800000,
        oldPrice: 3200000,
        tag: "-12%",
        type: "best",
        rating: 4,
        reviews: 12,
        img: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "p4",
        name: "Kệ Sách Đa Năng Modern",
        price: 3600000,
        oldPrice: null,
        tag: "Hot",
        type: "best",
        rating: 5,
        reviews: 21,
        img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "p5",
        name: "Giường Ngủ Gỗ King Size",
        price: 12900000,
        oldPrice: 14900000,
        tag: "-13%",
        type: "new",
        rating: 4,
        reviews: 9,
        img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "p6",
        name: "Bộ Bàn Ăn 6 Ghế",
        price: 15900000,
        oldPrice: null,
        tag: "Bán chạy",
        type: "best",
        rating: 5,
        reviews: 33,
        img: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "p7",
        name: "Đèn Trang Trí Đứng",
        price: 1850000,
        oldPrice: 2100000,
        tag: "-12%",
        type: "new",
        rating: 4,
        reviews: 14,
        img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "p8",
        name: "Ghế Thư Giãn Bọc Bền",
        price: 3100000,
        oldPrice: null,
        tag: "Hot",
        type: "best",
        rating: 5,
        reviews: 26,
        img: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=1200&q=80&auto=format&fit=crop",
      },
    ],
    []
  );

  const [tab, setTab] = useState("all"); // all | best | new

  const filtered = useMemo(() => {
    if (tab === "all") return products;
    if (tab === "best") return products.filter((p) => p.type === "best");
    return products.filter((p) => p.type === "new");
  }, [tab, products]);

  const heroImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1600&q=80&auto=format&fit=crop",
    ],
    []
  );

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // 5s đổi 1 ảnh

    return () => clearInterval(t);
  }, [heroImages.length]);



  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* ===== HERO SLIDER ===== */}
        <section className="w-full bg-[#0B1E3A]">
          <div className="relative w-full h-[360px] md:h-[420px] overflow-hidden">

            {heroImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300
          ${index === heroIndex ? "opacity-100" : "opacity-0"}
        `}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}

            {/* overlay */} 
            <div className="absolute inset-0 bg-black/55" />

            {/* content */}
            <div className="absolute inset-0">
              <div className="mx-auto max-w-7xl px-4 h-full flex items-center">
                <div className="max-w-xl text-white">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                    Nâng tầm không <br /> gian sống của bạn
                  </h1>

                  <p className="mt-4 text-sm md:text-base text-white/80 leading-6">
                    Khám phá các thiết kế nội thất hiện đại, tinh tế và tiện dụng,
                    dành riêng cho ngôi nhà của bạn.
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button className="bg-white text-slate-900 px-4 py-2 text-sm font-semibold rounded-md hover:bg-white/90">
                      Mua Ngay →
                    </button>
                    <button className="border border-white/60 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-white/10">
                      Xem Nội Thất
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* ===== CATEGORY ===== */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Danh Mục Sản Phẩm
                </h2>
                <p className="mt-1 text-xs text-slate-500 max-w-xl">
                  Khám phá các danh mục sản phẩm được yêu thích nhất của chúng tôi,
                  từ nội thất cơ bản đến những món đồ trang trí tinh tế.
                </p>
              </div>

              <button className="text-xs font-medium text-orange-500 hover:text-orange-600">
                Xem tất cả danh mục →
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-5">
              {categories.map((c) => (
                <div key={c.id} className="relative overflow-hidden rounded-lg">
                  <div className="aspect-[3/4] bg-slate-100">
                    <img
                      src={c.img}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white text-sm font-semibold leading-none">
                      {c.name}
                    </p>
                    <p className="mt-1 text-[10px] text-white/80">{c.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ===== PROMO BANNER CLEAN ===== */}
        <section className="bg-slate-50">

          <div className="mx-auto max-w-7xl px-4">


            <div
              className="bg-yellow-50 border border-slate-100 rounded-xl shadow-lg grid md:grid-cols-2 items-center overflow-hidden"
            >

              {/* TEXT */}

              <div className="p-10">

                <p className="text-xs font-semibold text-orange-500 tracking-wide">
                  NEW COLLECTION
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Bộ sưu tập nội thất mới
                </h2>

                <p className="mt-3 text-sm text-slate-500 max-w-md">
                  Khám phá những thiết kế mới nhất dành riêng cho không gian sống hiện đại.
                </p>

                <button
                  className="mt-6 bg-orange-500 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-orange-600"
                >
                  Khám phá ngay
                </button>
              </div>
              {/* IMAGE */}
              <div className="h-full">
                <img
                  src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section className="bg-slate-50 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-slate-900">
                Sản Phẩm Nổi Bật
              </h2>

              <div className="mt-3 flex justify-center">
                <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
                  <button
                    onClick={() => setTab("all")}
                    className={
                      tab === "all"
                        ? "px-4 py-2 text-xs rounded-full bg-slate-900 text-white"
                        : "px-4 py-2 text-xs rounded-full text-slate-500 hover:text-slate-900"
                    }
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setTab("best")}
                    className={
                      tab === "best"
                        ? "px-4 py-2 text-xs rounded-full bg-slate-900 text-white"
                        : "px-4 py-2 text-xs rounded-full text-slate-500 hover:text-slate-900"
                    }
                  >
                    Bán chạy
                  </button>
                  <button
                    onClick={() => setTab("new")}
                    className={
                      tab === "new"
                        ? "px-4 py-2 text-xs rounded-full bg-slate-900 text-white"
                        : "px-4 py-2 text-xs rounded-full text-slate-500 hover:text-slate-900"
                    }
                  >
                    Mới về
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl bg-white border border-slate-200 overflow-hidden"
                >
                  <div className="relative">
                    <div className="aspect-[4/3] bg-slate-100">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {p.tag && (
                      <span className="absolute top-2 left-2 rounded bg-black/70 px-2 py-1 text-[10px] text-white">
                        {p.tag}
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-[12px] font-semibold text-slate-900 line-clamp-2 min-h-[32px]">
                      {p.name}
                    </p>

                    {/* Rating giống figma */}
                    <div className="mt-1 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < (p.rating ?? 0)
                              ? "text-yellow-400 text-[10px]"
                              : "text-slate-300 text-[10px]"
                          }
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-[11px] text-slate-500 ml-1">
                        ({p.reviews ?? 0})
                      </span>
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <div>
                        <p className="text-[12px] font-bold text-slate-900">
                          {formatVND(p.price)}
                        </p>
                        {p.oldPrice && (
                          <p className="text-[11px] text-slate-400 line-through">
                            {formatVND(p.oldPrice)}
                          </p>
                        )}
                      </div>

                      <button className="text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
                        Xem
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button className="border border-slate-300 bg-white px-6 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 rounded-md">
                XEM TẤT CẢ SẢN PHẨM
              </button>
            </div>
          </div>
        </section>
        {/* ===== FEATURES CLEAN ===== */}
        <section className="pb-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4">

            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-slate-900">
                Vì Sao Chọn Chúng Tôi
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Trải nghiệm mua sắm nội thất nhanh chóng, an tâm và tiện lợi.
              </p>
            </div>


            <div className="grid md:grid-cols-4 gap-6">

              {[
                { icon: "🚚", title: "Giao hàng nhanh", desc: "Toàn quốc trong 3-5 ngày" },
                { icon: "💳", title: "Thanh toán an toàn", desc: "Nhiều phương thức tiện lợi" },
                { icon: "⭐", title: "Chất lượng cao", desc: "Kiểm định kỹ lưỡng trước khi giao" },
                { icon: "🔄", title: "Đổi trả dễ dàng", desc: "Hỗ trợ đổi trả trong 7 ngày" },
              ].map((f, i) => (

                <div
                  key={i}
                  className="bg-grey-50 shadow-mdborder border-slate-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition ">

                  <div className="text-3xl mb-3">
                    {f.icon}
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    {f.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    {f.desc}
                  </p>

                </div>

              ))}

            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function formatVND(v) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v);
}