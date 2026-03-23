import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/ui/header";
import Footer from "../components/ui/footer";
import ModelViewer3D from "../components/3D/ModelViewer3D";
import { getProductById } from "../lib/api";
import { useCart } from "../hooks/useCart";
import { useCartActions } from "../hooks/useCartActions";
import {
  ZoomIn, ZoomOut, Ruler, Box, LayoutGrid, List, Share, Minus, Plus,
  Info, ShoppingCart, Heart, ChevronRight, Star, Truck, RotateCcw,
  Wrench, ShieldCheck,
} from "lucide-react";

export default function ProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);
 
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);

  const { refetch } = useCart();
  const { handleAddToCart: addToCartAction } = useCartActions(refetch);

  const finishingTabs = ["Màu sắc", "Ván ép", "Hiệu ứng vân gỗ"];

  // Từ điển màu sắc
  const colorDictionary = {
    'Trắng': { hex: '#FFFFFF', tailwind: 'bg-white border-2 border-gray-200' },
    'Nâu': { hex: '#8B4513', tailwind: 'bg-[#8B4513]' },
    'Nâu đậm': { hex: '#C69B7B', tailwind: 'bg-[#C69B7B]' },
    'Đen': { hex: '#2A2A2A', tailwind: 'bg-[#2A2A2A]' },
    'Đen nhám': { hex: '#2A2A2A', tailwind: 'bg-[#2A2A2A]' },
    'Gỗ sồi': { hex: '#E5E4E0', tailwind: 'bg-[#E5E4E0]' },
    'Xám': { hex: '#808080', tailwind: 'bg-gray-500' },
    'Xanh Navy': { hex: '#000080', tailwind: 'bg-blue-900' },
    'Nâu da bò': { hex: '#A52A2A', tailwind: 'bg-orange-800' },
    'Vân gỗ sáng': { hex: '#DEB887', tailwind: 'bg-[#DEB887]' },
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        setError(err.message || "Không thể tải dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);
  const mongoData = product?.variants || {};
  const variantList = mongoData.variants || [];
  const model3dUrl = mongoData.model3d || null;

  const productImages = useMemo(() => {
    const urls = mongoData.images;
    if (!Array.isArray(urls)) return [];
    return urls.filter(
      (url) => typeof url === "string" && url.trim() !== ""
    );
  }, [mongoData]);
  const availableVariants = useMemo(() => {
    if (!variantList.length) return [];
    return variantList.map((variant) => {
      const colorName = variant.specs?.color || "Mặc định";
      const mappedColor = colorDictionary[colorName] || { hex: "#CCCCCC", tailwind: "bg-gray-300" };
      return {
        ...variant,
        colorName,
        hex: mappedColor.hex,
        tailwind: mappedColor.tailwind,
      };
    });
  }, [variantList]);
  const activeVariant = availableVariants[activeVariantIndex] || null;
  const uniqueDimensionsList = useMemo(() => {
    if (!availableVariants.length) return [];
    const dims = [];
    availableVariants.forEach(v => {
      const dimStr = `${v.specs?.dimensions?.length || 0}x${v.specs?.dimensions?.width || 0}x${v.specs?.dimensions?.height || 0}`;
      if (!dims.find(d => d.dimStr === dimStr)) {
        dims.push({ ...v.specs.dimensions, dimStr });
      }
    });
    return dims;
  }, [availableVariants]);
  const uniqueColorsList = useMemo(() => {
    if (!availableVariants.length) return [];
    const colors = [];
    availableVariants.forEach(v => {
      if (!colors.find(c => c.colorName === v.colorName)) {
        colors.push({ colorName: v.colorName, tailwind: v.tailwind, hex: v.hex });
      }
    });
    return colors;
  }, [availableVariants]);
  const handleSizeClick = (dimStr) => {
    const currentColor = activeVariant?.colorName;
    let targetIndex = availableVariants.findIndex(v => {
      const vDimStr = `${v.specs?.dimensions?.length || 0}x${v.specs?.dimensions?.width || 0}x${v.specs?.dimensions?.height || 0}`;
      return vDimStr === dimStr && v.colorName === currentColor;
    });
    if (targetIndex === -1) {
      targetIndex = availableVariants.findIndex(v => {
        const vDimStr = `${v.specs?.dimensions?.length || 0}x${v.specs?.dimensions?.width || 0}x${v.specs?.dimensions?.height || 0}`;
        return vDimStr === dimStr;
      });
    }
    if (targetIndex !== -1) setActiveVariantIndex(targetIndex);
  };

  const handleAddToCart = () => {
    if (!activeVariant) return;

    const productId = id;
    const quantity = 1;
    const price = activeVariant.price || product.price || 0;
    const material = activeVariant.specs?.material || "N/A";
    const color = activeVariant.colorName || "N/A";
    
    addToCartAction(productId, price, material, color);
  };

  const handleColorClick = (colorName) => {
    const currentDimStr = `${activeVariant?.specs?.dimensions?.length || 0}x${activeVariant?.specs?.dimensions?.width || 0}x${activeVariant?.specs?.dimensions?.height || 0}`;
    let targetIndex = availableVariants.findIndex(v => {
      const vDimStr = `${v.specs?.dimensions?.length || 0}x${v.specs?.dimensions?.width || 0}x${v.specs?.dimensions?.height || 0}`;
      return v.colorName === colorName && vDimStr === currentDimStr;
    });
    if (targetIndex === -1) {
      targetIndex = availableVariants.findIndex(v => v.colorName === colorName);
    }
    if (targetIndex !== -1) setActiveVariantIndex(targetIndex);
  };
  const averageRating = product?.average_rating || 4.9;
  const reviewCount = product?.review_count || 0;
  const reviews = product?.reviews || [];

  const specs = [
    {
      title: "Kích thước & chi tiết",
      content: `Dài: ${activeVariant?.specs?.dimensions?.length || "N/A"}cm • Rộng: ${activeVariant?.specs?.dimensions?.width || "N/A"}cm • Cao: ${activeVariant?.specs?.dimensions?.height || "N/A"}cm • Nặng: ${activeVariant?.specs?.weight || "N/A"}kg`,
    },
    {
      title: "Mô tả",
      content: product?.product_description || "Sản phẩm chưa có mô tả.",
    },
    {
      title: "Vật liệu",
      content: `Chất liệu: ${activeVariant?.specs?.material || "N/A"} • Màu sắc: ${activeVariant?.specs?.color || "N/A"} • Tồn kho: ${activeVariant?.stock ?? "N/A"}`,
    },
  ];

  const features = [
    {
      title: "Xếp hạng đánh giá được thu thập tại",
      subtitle: (
        <div className="flex items-center gap-1 font-bold mt-1 text-sm">
          {averageRating}/5
          <div className="flex text-black">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>
      ),
    },
    { icon: <Truck className="text-gray-600" size={24} />, title: "Sản xuất theo đơn đặt hàng", hasArrow: false },
    { icon: <RotateCcw className="text-gray-600" size={24} />, title: "Đổi trả miễn phí trong vòng 100 ngày", hasArrow: true },
    { icon: <Wrench className="text-gray-600" size={24} />, title: "Dịch vụ lắp ráp tùy chọn", hasArrow: true },
    { icon: <ShieldCheck className="text-gray-600" size={24} />, title: "Bảo hành 10 năm", hasArrow: true },
  ];
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Header />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-lg font-medium text-gray-500">
          Đang tải dữ liệu sản phẩm...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Header />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-lg font-medium text-red-600">
          {error || "Không tìm thấy sản phẩm"}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-xl font-medium text-gray-500">
            {product.category_name} / {product.product_name}
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 mb-16 h-full min-h-[700px]">
          {/*  HIỂN THỊ 3D / ẢNH */}
          <div className="flex-1 bg-[#F1F2F4] rounded-2xl relative border border-gray-200 overflow-hidden flex flex-col justify-between p-8">
            <div className="absolute top-8 left-8 z-10 max-w-sm">
              <p className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                {product.product_name}
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center relative w-full mt-12 mb-16 min-h-[400px] bg-gray-50 rounded-xl overflow-hidden shadow-inner">
              {model3dUrl ? (
                <ModelViewer3D
                  src={model3dUrl}
                  colorHex={activeVariant?.hex || '#FFFFFF'}
                  alt={product.product_name}
                />
              ) : (
                <img
                  src={productImages[0] || "https://via.placeholder.com/600"}
                  alt="Sản phẩm"
                  className="object-contain w-full h-full max-h-[500px]"
                />
              )}
            </div>

            <div className="flex justify-center w-full relative z-10">
              <div className="bg-white/80 backdrop-blur-md shadow-sm border border-gray-200 rounded-full flex items-center p-2 gap-2">
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"><ZoomOut size={20} /></button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"><ZoomIn size={20} /></button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"><Ruler size={20} /></button>
                <button className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center"><Box size={20} /></button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"><LayoutGrid size={20} /></button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"><List size={20} /></button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"><Share size={20} /></button>
              </div>
            </div>
          </div>

          {/*TÙY CHỌN & GIỎ HÀNG */}
          <div className="w-full lg:w-[420px] flex flex-col pt-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[28px] font-bold text-red-600">
                {activeVariant?.price
                  ? `${Number(activeVariant.price).toLocaleString("vi-VN")} đ`
                  : "Liên hệ"}
              </span>
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-md uppercase">
                {activeVariant?.status || "AVAILABLE"}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-4 font-medium">
              Mã: {activeVariant?.sku || "N/A"} • Tồn kho: {activeVariant?.stock ?? "N/A"}
            </p>

            <div className="flex bg-gray-100 rounded-full p-1 mb-4">
              <button className="flex-1 bg-white shadow-sm rounded-full py-2 text-sm font-medium text-gray-900">
                Hình thức
              </button>
              <button className="flex-1 rounded-full py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                Chức năng
              </button>
            </div>

            <div className="h-px bg-gray-200 mb-4"></div>

            <div className="space-y-4 mb-4">
              
              {/* LỰA CHỌN KÍCH THƯỚC */}
              <div className="pt-2">
                <span className="text-sm font-bold text-gray-900 mb-3 block">Kích thước (Dài x Rộng x Cao)</span>
                <div className="flex flex-wrap gap-2 mb-4">
                  {uniqueDimensionsList.map((dim, index) => {
                    const activeDimStr = `${activeVariant?.specs?.dimensions?.length || 0}x${activeVariant?.specs?.dimensions?.width || 0}x${activeVariant?.specs?.dimensions?.height || 0}`;
                    const isActive = activeDimStr === dim.dimStr;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleSizeClick(dim.dimStr)}
                        className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all ${
                          isActive
                            ? "bg-red-50 text-red-600 border-red-500"
                            : "bg-white text-gray-700 border-gray-200 hover:border-red-300"
                        }`}
                      >
                        {dim.length} x {dim.width} x {dim.height} cm
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LỰA CHỌN MÀU SẮC */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-900">Màu sắc</span>
                  <span className="text-sm font-medium text-gray-500">{activeVariant?.colorName}</span>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  {uniqueColorsList.map((colorObj, idx) => {
                    const isActive = activeVariant?.colorName === colorObj.colorName;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleColorClick(colorObj.colorName)} 
                        className={`w-9 h-9 rounded-full transition-all duration-200 ${colorObj.tailwind} ${
                          isActive 
                            ? 'ring-2 ring-offset-2 ring-red-500 scale-110' 
                            : 'hover:scale-110 border border-gray-200 shadow-sm'
                        }`}
                        title={colorObj.colorName}
                      ></button>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!activeVariant || activeVariant.stock <= 0}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full py-3.5 px-4 font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart size={20} />
                  {activeVariant?.stock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
                </button>
                <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 rounded-full py-3.5 px-6 font-bold flex items-center justify-center gap-2 transition-colors">
                  <Heart size={20} className="text-gray-400" />
                  Lưu
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 border-t border-gray-100 pt-4">
                <div>
                  Hàng được giao trong vòng 8 tuần
                  <a href="#" className="font-bold text-gray-900 underline block mt-1">
                    Xem thông tin thanh toán
                  </a>
                </div>
                <div>
                  Được sản xuất tại Việt Nam
                  <a href="#" className="font-bold text-gray-900 underline block mt-1">
                    Giao hàng & trả hàng
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {features.map((feature, index) => (
              <React.Fragment key={index}>
                <div className="flex items-start gap-3 flex-1 px-4 cursor-pointer group">
                  {feature.icon && <div className="mt-0.5">{feature.icon}</div>}
                  <div>
                    <p className="text-sm font-medium text-gray-900 leading-tight group-hover:underline">
                      {feature.title}
                    </p>
                    {feature.subtitle}
                  </div>
                  {feature.hasArrow && (
                    <ChevronRight size={20} className="text-gray-400 ml-auto mt-0.5" />
                  )}
                </div>
                {index < features.length - 1 && (
                  <div className="w-px h-10 bg-gray-200 hidden lg:block"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 inline-block">
            Hình ảnh chi tiết sản phẩm
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          {productImages.length > 0 ? (
            <>
              <div className="md:col-span-2 md:row-span-2 h-[400px] md:h-full group overflow-hidden rounded-xl relative bg-gray-100">
                <img src={productImages[0]} alt={product.product_name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <div className="md:col-span-1 md:row-span-1 h-[250px] md:h-full group overflow-hidden rounded-xl relative bg-gray-100">
                {productImages[1] ? (
                  <img src={productImages[1]} alt={product.product_name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">Không có ảnh</div>
                )}
              </div>
              <div className="md:col-span-1 md:row-span-1 grid grid-cols-2 gap-4 h-[200px] md:h-full">
                <div className="group overflow-hidden rounded-xl relative bg-gray-100">
                  {productImages[2] ? (
                    <img src={productImages[2]} alt={product.product_name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Trống</div>
                  )}
                </div>
                <div className="group overflow-hidden rounded-xl relative bg-gray-100">
                  {productImages[3] ? (
                    <img src={productImages[3]} alt={product.product_name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Trống</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="md:col-span-3 h-[400px] flex items-center justify-center text-gray-400 bg-gray-100 rounded-xl">
              Không có ảnh chi tiết
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-2">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3 flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 pr-4">
                Thông số kỹ thuật đồ nội thất của bạn
              </h2>
            </div>
          </div>

          <div className="md:w-2/3 border-t border-gray-200">
            {specs.map((spec, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="text-[15px] font-bold text-gray-900 leading-none">
                      {spec.title}
                    </span>
                    <span className="text-gray-400 ml-4 group-hover:text-gray-600">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pb-5 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                      {spec.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="border-t border-gray-200 pt-10">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 leading-none">
              Đánh giá & Bình luận ({reviewCount})
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3 lg:shrink-0">
              <div className="p-5 border-2 border-gray-200 rounded-2xl bg-white shadow-sm h-full flex flex-col">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700 block mb-2">Đánh giá của bạn:</span>
                  <div className="flex space-x-1 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setUserRating(star)} className="focus:outline-none">
                        <Star size={24} className={`transition-colors ${star <= userRating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`} fill={star <= userRating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea placeholder="Viết trải nghiệm của bạn về sản phẩm này..." className="flex-1 w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 min-h-[100px] resize-none"></textarea>
                <div className="mt-4 flex justify-end">
                  <button className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">Gửi đánh giá</button>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 border-2 border-gray-200 rounded-2xl p-4 sm:p-5 bg-white shadow-sm h-[310px]">
              <div className="flex flex-col overflow-y-auto gap-3 snap-y snap-mandatory h-full pr-2" style={{ scrollbarWidth: "thin" }}>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.review_id} className="w-full shrink-0 h-auto p-4 snap-start border-2 border-gray-200 rounded-xl flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-sm text-gray-900">{review.username}</div>
                        <div className="flex space-x-0.5 text-yellow-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={14} fill={star <= review.rating ? "currentColor" : "none"} className={star <= review.rating ? "" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.review_comment}</p>
                      <span className="text-xs text-gray-400 mt-2 block">{new Date(review.review_date).toLocaleDateString("vi-VN")}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">Chưa có đánh giá nào.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}