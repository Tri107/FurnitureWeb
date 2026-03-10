import { useMemo, useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, X } from "lucide-react";

function formatVND(v) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v);
}

export default function Header() {
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cartItems = useMemo(
    () => [
      {
        id: "c1",
        name: "Sofa Vải Nỉ Bắc Âu",
        price: 8500000,
        qty: 1,
        img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80&auto=format&fit=crop",
      },
      {
        id: "c2",
        name: "Bàn Trà Gỗ Sồi Tự Nhiên",
        price: 2800000,
        qty: 2,
        img: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=400&q=80&auto=format&fit=crop",
      },
    ],
    []
  );

  const cartCount = cartItems.reduce((s, it) => s + it.qty, 0);
  const cartTotal = cartItems.reduce((s, it) => s + it.price * it.qty, 0);

  const mega = useMemo(
    () => ({
      living: {
        label: "Phòng Khách",
        megaTitle: "PHÒNG KHÁCH",
        desc: "Sofa, bàn kệ, ghế & combo tối ưu cho phòng khách.",
        featured: [
          {
            title: "Top Sofa chữ L",
            sub: "Gợi ý theo xu hướng",
            href: "/products?category=living&sub=sofa-l",
            img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80&auto=format&fit=crop",
          },
          {
            title: "Combo Sofa + Bàn Trà",
            sub: "Mua trọn bộ tiết kiệm",
            href: "/products?category=living&sub=combo-sofa-ban-tra",
            img: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=1200&q=80&auto=format&fit=crop",
          },
        ],
        groups: [
          {
            title: "Sofa",
            items: [
              { label: "Sofa chữ L", href: "/products?category=living&sub=sofa-l" },
              { label: "Sofa băng", href: "/products?category=living&sub=sofa-bang" },
              { label: "Sofa đơn", href: "/products?category=living&sub=sofa-don" },
              { label: "Sofa giường", href: "/products?category=living&sub=sofa-giuong" },
            ],
          },
          {
            title: "Bàn & Kệ",
            items: [
              { label: "Bàn trà", href: "/products?category=living&sub=ban-tra" },
              { label: "Kệ TV", href: "/products?category=living&sub=ke-tv" },
              { label: "Tủ trang trí", href: "/products?category=living&sub=tu-trang-tri" },
              { label: "Kệ sách", href: "/products?category=living&sub=ke-sach" },
            ],
          },
          {
            title: "Ghế",
            items: [
              { label: "Ghế thư giãn", href: "/products?category=living&sub=ghe-thu-gian" },
              { label: "Ghế đôn", href: "/products?category=living&sub=ghe-don" },
              { label: "Ghế bập bênh", href: "/products?category=living&sub=ghe-bap-benh" },
            ],
          },
          {
            title: "Combo",
            items: [
              { label: "Combo sofa + bàn trà", href: "/products?category=living&sub=combo-sofa-ban-tra" },
              { label: "Combo đầy đủ (Sofa + Bàn + Kệ TV)", href: "/products?category=living&sub=combo-day-du" },
            ],
          },
        ],
      },

      bedroom: {
        label: "Phòng Ngủ",
        megaTitle: "PHÒNG NGỦ",
        desc: "Giường, tủ, nệm & phụ kiện cho giấc ngủ êm ái.",
        featured: [
          {
            title: "Giường có ngăn kéo",
            sub: "Tối ưu lưu trữ",
            href: "/products?category=bedroom&sub=giuong-ngan-keo",
            img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop",
          },
          {
            title: "Combo Nệm + Ga gối",
            sub: "Mềm & thoáng",
            href: "/products?category=bedroom&sub=ga-goi",
            img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=80&auto=format&fit=crop",
          },
        ],
        groups: [
          {
            title: "Giường ngủ",
            items: [
              { label: "Giường đơn", href: "/products?category=bedroom&sub=giuong-don" },
              { label: "Giường đôi", href: "/products?category=bedroom&sub=giuong-doi" },
              { label: "Giường có ngăn kéo", href: "/products?category=bedroom&sub=giuong-ngan-keo" },
              { label: "Giường tầng", href: "/products?category=bedroom&sub=giuong-tang" },
            ],
          },
          {
            title: "Tủ & Lưu trữ",
            items: [
              { label: "Tủ quần áo 2/3 cánh/cửa lùa", href: "/products?category=bedroom&sub=tu-quan-ao" },
              { label: "Tủ đầu giường", href: "/products?category=bedroom&sub=tu-dau-giuong" },
              { label: "Bàn trang điểm", href: "/products?category=bedroom&sub=ban-trang-diem" },
              { label: "Kệ đầu giường", href: "/products?category=bedroom&sub=ke-dau-giuong" },
            ],
          },
          {
            title: "Nệm & Phụ kiện",
            items: [
              { label: "Nệm cao su", href: "/products?category=bedroom&sub=nem-cao-su" },
              { label: "Nệm lò xo", href: "/products?category=bedroom&sub=nem-lo-xo" },
              { label: "Ga gối", href: "/products?category=bedroom&sub=ga-goi" },
              { label: "Đèn ngủ", href: "/products?category=bedroom&sub=den-ngu" },
            ],
          },
        ],
      },

      dining: {
        label: "Phòng Ăn",
        megaTitle: "PHÒNG ĂN",
        desc: "Bàn ăn, ghế & tủ trang trí cho bữa cơm ấm cúng.",
        featured: [
          {
            title: "Bàn ăn mặt đá",
            sub: "Sang & bền",
            href: "/products?category=dining&sub=ban-an-mat-da",
            img: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80&auto=format&fit=crop",
          },
          {
            title: "Bàn ăn 6 ghế",
            sub: "Phù hợp gia đình",
            href: "/products?category=dining&sub=ban-an-6-ghe",
            img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=80&auto=format&fit=crop",
          },
        ],
        groups: [
          {
            title: "Bàn ăn",
            items: [
              { label: "Bàn ăn 4 ghế", href: "/products?category=dining&sub=ban-an-4-ghe" },
              { label: "Bàn ăn 6 ghế", href: "/products?category=dining&sub=ban-an-6-ghe" },
              { label: "Bàn ăn mặt đá", href: "/products?category=dining&sub=ban-an-mat-da" },
              { label: "Bàn ăn gỗ tự nhiên", href: "/products?category=dining&sub=ban-an-go-tu-nhien" },
            ],
          },
          {
            title: "Ghế ăn",
            items: [
              { label: "Ghế gỗ", href: "/products?category=dining&sub=ghe-go" },
              { label: "Ghế bọc nệm", href: "/products?category=dining&sub=ghe-boc-nem" },
              { label: "Ghế nhựa hiện đại", href: "/products?category=dining&sub=ghe-nhua" },
            ],
          },
          {
            title: "Tủ & Trang trí",
            items: [
              { label: "Tủ rượu", href: "/products?category=dining&sub=tu-ruou" },
              { label: "Tủ chén", href: "/products?category=dining&sub=tu-chen" },
              { label: "Kệ trang trí phòng ăn", href: "/products?category=dining&sub=ke-trang-tri" },
            ],
          },
        ],
      },

      decor: {
        label: "Trang Trí",
        megaTitle: "TRANG TRÍ",
        desc: "Đèn, tranh, gương & decor làm nhà bạn có gu hơn.",
        featured: [
          {
            title: "Đèn cây",
            sub: "Tạo điểm nhấn",
            href: "/products?category=decor&sub=den-cay",
            img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&q=80&auto=format&fit=crop",
          },
          {
            title: "Thảm trải sàn",
            sub: "Ấm & êm",
            href: "/products?category=decor&sub=tham",
            img: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&q=80&auto=format&fit=crop",
          },
        ],
        groups: [
          {
            title: "Trang trí tường",
            items: [
              { label: "Tranh treo tường", href: "/products?category=decor&sub=tranh" },
              { label: "Gương trang trí", href: "/products?category=decor&sub=guong" },
              { label: "Đồng hồ treo tường", href: "/products?category=decor&sub=dong-ho" },
            ],
          },
          {
            title: "Đèn",
            items: [
              { label: "Đèn chùm", href: "/products?category=decor&sub=den-chum" },
              { label: "Đèn bàn", href: "/products?category=decor&sub=den-ban" },
              { label: "Đèn cây", href: "/products?category=decor&sub=den-cay" },
              { label: "Đèn LED trang trí", href: "/products?category=decor&sub=den-led" },
            ],
          },
          {
            title: "Phụ kiện decor",
            items: [
              { label: "Thảm trải sàn", href: "/products?category=decor&sub=tham" },
              { label: "Rèm cửa", href: "/products?category=decor&sub=rem" },
              { label: "Bình hoa", href: "/products?category=decor&sub=binh-hoa" },
              { label: "Cây giả trang trí", href: "/products?category=decor&sub=cay-gia" },
              { label: "Tượng decor", href: "/products?category=decor&sub=tuong" },
            ],
          },
        ],
      },
    }),
    []
  );

  const keys = ["living", "bedroom", "dining", "decor"];

  const [activeKey, setActiveKey] = useState(null);
  const [openMega, setOpenMega] = useState(false);
  const megaCloseTimer = useRef(null);

  const showMega = (key) => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    setActiveKey(key);
    setOpenMega(true);
    setOpenRight(null);
    setSearchOpen(false);
  };

  const scheduleCloseMega = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    megaCloseTimer.current = setTimeout(() => {
      setOpenMega(false);
      setActiveKey(null);
    }, 140);
  };

  const cancelCloseMega = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
  };

  const closeMega = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    setOpenMega(false);
    setActiveKey(null);
  };

  const [openRight, setOpenRight] = useState(null);
  const toggleRight = (k) => {
    closeMega();
    setSearchOpen(false);
    setOpenRight((prev) => (prev === k ? null : k));
  };
  const closeRight = () => setOpenRight(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef(null);

  const openSearch = () => {
    closeMega();
    setOpenRight(null);
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const rightWrapRef = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {
      if (!rightWrapRef.current) return;
      if (!rightWrapRef.current.contains(e.target)) {
        setOpenRight(null);
        if (searchOpen) closeSearch();
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [searchOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const pool = [
      ...cartItems.map((x) => ({ ...x, href: "/products" })),
      {
        id: "s1",
        name: "Đèn Trang Trí Đứng",
        price: 1850000,
        href: "/products?category=decor",
        img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&q=80&auto=format&fit=crop",
      },
      {
        id: "s2",
        name: "Giường Ngủ Gỗ King Size",
        price: 12900000,
        href: "/products?category=bedroom",
        img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80&auto=format&fit=crop",
      },
    ];
    return pool.filter((p) => (p.name || "").toLowerCase().includes(q)).slice(0, 6);
  }, [query, cartItems]);

  useEffect(() => {
    closeMega();
    closeRight();
    if (searchOpen) closeSearch();
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        closeMega();
        closeRight();
        if (searchOpen) closeSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const activeMega = activeKey ? mega[activeKey] : null;

  const onSubmitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
  };

  return (
    <header className="w-full bg-[#0B1E3A] text-white shadow-sm sticky top-0 z-[80]">
      <div className="mx-auto max-w-7xl px-3 lg:px-10 h-20 flex items-center">
        <Link to="/" className="font-bold text-2xl !text-orange-500 tracking-wide">
          B2VT
        </Link>

        <nav className="hidden md:flex flex-1 justify-center gap-10 text-base font-medium">
          <Link to="/products" className="hover:text-orange-400 transition">
            Sản Phẩm
          </Link>

          {keys.map((key) => (
            <button
              key={key}
              type="button"
              onMouseEnter={() => showMega(key)}
              onMouseLeave={scheduleCloseMega}
              className={[
                "relative hover:text-orange-400 transition",
                activeKey === key && openMega ? "text-orange-400" : "",
              ].join(" ")}
            >
              {mega[key].label}
              <span
                className={[
                  "absolute -bottom-2 left-0 h-[2px] w-full bg-orange-500 transition-opacity",
                  activeKey === key && openMega ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            </button>
          ))}
        </nav>

        <div ref={rightWrapRef} className="ml-auto flex items-center gap-3 relative">
          <form
            onSubmit={onSubmitSearch}
            className={[
              "flex items-center gap-2 rounded-full bg-white/10 border border-white/15",
              "transition-all duration-200 ease-out overflow-hidden",
              searchOpen ? "w-[240px] px-2.5 py-1.5" : "w-9 px-1.5 py-1.5"
            ].join(" ")}
          >
            <button
              type="button"
              onClick={() => {
                if (!searchOpen) openSearch();
                else searchInputRef.current?.focus();
              }}className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition"
              
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px] text-white/90" />
            </button>

            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập từ khóa cần tìm..."
              className={[
                "bg-transparent text-sm outline-none placeholder:text-white/60",
                "transition-opacity duration-150",
                searchOpen ? "opacity-100 w-full" : "opacity-0 w-0 pointer-events-none",
              ].join(" ")}
            />

            {searchOpen && (
              <button
                type="button"
                onClick={closeSearch}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-white/80" />
              </button>
            )}
          </form>

          {searchOpen && query.trim() && (
            <div className="absolute right-0 top-[56px] z-[90] w-[360px] rounded-2xl border border-white/10 bg-[#06162d]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
              <div className="p-2">
                {searchResults.length === 0 ? (
                  <p className="p-3 text-sm text-white/70">Không tìm thấy sản phẩm phù hợp.</p>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map((r) => (
                      <Link
                        key={r.id}
                        to={r.href || "/products"}
                        onClick={() => {
                          closeSearch();
                          closeRight();
                        }}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition"
                      >
                        <img
                          src={r.img}
                          alt={r.name}
                          className="h-10 w-10 rounded-lg object-cover border border-white/10"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate">{r.name}</p>
                          <p className="text-xs text-white/70">{formatVND(r.price)}</p>
                        </div>
                        <span className="text-white/50 text-sm">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => toggleRight("cart")}
            className={[
              "relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:text-orange-400 transition",
              openRight === "cart" ? "text-orange-400 border-orange-400/30" : "text-white",
            ].join(" ")}
            aria-label="Cart"
          >
            <ShoppingCart className="h-[19px] w-[19px]" />
            <span className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleRight("account")}
            className={[
              "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:text-orange-400 transition",
              openRight === "account" ? "text-orange-400 border-orange-400/30" : "text-white",
            ].join(" ")}
            aria-label="Account"
          >
            <User className="h-[19px] w-[19px]" />
          </button>

          {openRight && (
            <div className="absolute right-0 top-[56px] z-[90]">
              {openRight === "cart" && (
                <div className="w-[380px] rounded-2xl border border-white/10 bg-[#06162d]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div>
                      <p className="text-sm font-semibold">Giỏ hàng</p>
                      <p className="text-xs text-white/60">{cartCount} món</p>
                    </div>
                    <button
                      type="button"
                      onClick={closeRight}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition"
                      aria-label="Close"
                    >
                      <X className="h-[18px] w-[18px] text-white/70" />
                    </button>
                  </div>

                  <div className="max-h-[320px] overflow-auto p-3 space-y-2">
                    {cartItems.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center gap-3 rounded-xl p-2 bg-white/5 border border-white/10"
                      >
                        <img src={it.img} alt={it.name} className="h-14 w-14 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate">{it.name}</p>
                          <p className="text-xs text-white/70 mt-0.5">
                            {formatVND(it.price)} • SL: <span className="text-white">{it.qty}</span>
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-white">{formatVND(it.price * it.qty)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Tạm tính</span>
                      <span className="font-semibold text-white">{formatVND(cartTotal)}</span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        to="/cart"
                        onClick={closeRight}
                        className="text-center rounded-xl border border-white/15 bg-white/5 py-2 text-sm font-semibold hover:bg-white/10 transition"
                      >
                        Xem giỏ
                      </Link>
                      <Link
                        to="/checkout"
                        onClick={closeRight}
                        className="text-center rounded-xl bg-orange-500 py-2 text-sm font-semibold text-white hover:bg-orange-400 transition"
                      >
                        Thanh toán
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {openRight === "account" && (
                <div className="w-[260px] rounded-2xl border border-white/10 bg-[#06162d]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <p className="text-sm font-semibold">Tài khoản</p>
                    <button
                      type="button"
                      onClick={closeRight}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition"
                      aria-label="Close"
                    >
                      <X className="h-[18px] w-[18px] text-white/70" />
                    </button>
                  </div>

                  {!isLoggedIn ? (
                    <div className="p-3 space-y-2">
                      <Link
                        to="/login"
                        onClick={closeRight}
                        className="block rounded-xl bg-orange-500 text-center py-2 text-sm font-semibold text-white hover:bg-orange-400 transition"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeRight}
                        className="block rounded-xl border border-white/15 bg-white/5 text-center py-2 text-sm font-semibold hover:bg-white/10 transition"
                      >
                        Đăng ký
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsLoggedIn(true);
                          closeRight();
                        }}
                        className="mt-2 w-full text-xs text-white/60 hover:text-white/80 transition"
                      >
                        (test) set logged in
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 space-y-1">
                      <Link
                        to="/account"
                        onClick={closeRight}
                        className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
                      >
                        Thông tin cá nhân
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={closeRight}
                        className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
                      >
                        Yêu thích
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLoggedIn(false);
                          closeRight();
                        }}
                        className="w-full text-left rounded-xl px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className={[
          "fixed inset-x-0 top-20 bottom-0 z-[50] transition-opacity duration-200",
          openMega ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onMouseEnter={cancelCloseMega}
        onMouseLeave={scheduleCloseMega}
        onClick={closeMega}
      >
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div
        className={[
          "fixed left-0 top-20 w-full z-[55]",
          "transition-all duration-200 ease-out",
          openMega
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
        onMouseEnter={cancelCloseMega}
        onMouseLeave={scheduleCloseMega}
      >
        <div className="bg-[#06162d]/92 backdrop-blur-xl border-t border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="mx-auto max-w-7xl px-3 lg:px-10 py-8">
            {!activeMega ? null : (
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-12 lg:col-span-3">
                  <p className="text-xs tracking-[0.28em] text-white/60 uppercase">
                    {activeMega.megaTitle}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold">{activeMega.label}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-6">{activeMega.desc}</p>

                  <Link
                    to={`/products?category=${activeKey}`}
                    onClick={closeMega}
                    className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-orange-400 hover:text-orange-300 transition"
                  >
                    Xem tất cả <span className="translate-y-[1px]">→</span>
                  </Link>

                  <div className="mt-6 h-px bg-white/10" />
                </div>

                <div className="col-span-12 lg:col-span-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeMega.groups.map((g) => (
                      <div key={g.title}>
                        <p className="text-sm font-semibold text-white mb-3">{g.title}</p>
                        <div className="space-y-2">
                          {g.items.map((it) => (
                            <Link
                              key={it.href}
                              to={it.href}
                              onClick={closeMega}
                              className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-white/75 hover:text-white hover:bg-white/5 transition"
                            >
                              <span>{it.label}</span>
                              <span className="opacity-0 group-hover:opacity-100 transition text-white/60">
                                →
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-3">
                  <p className="text-sm font-semibold text-white mb-3">Gợi ý nổi bật</p>
                  <div className="space-y-4">
                    {(activeMega.featured || []).map((f) => (
                      <Link
                        key={f.href}
                        to={f.href}
                        onClick={closeMega}
                        className="group block rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition"
                      >
                        <div className="relative h-28">
                          <img
                            src={f.img}
                            alt={f.title}
                            className="absolute inset-0 h-full w-full object-cover opacity-90 group-hover:opacity-100 transition"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold text-white">{f.title}</p>
                          <p className="text-xs text-white/70 mt-1">{f.sub}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-white/10" />
        </div>
      </div>
    </header>
  );
}