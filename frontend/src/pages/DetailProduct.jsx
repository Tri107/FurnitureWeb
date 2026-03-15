import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/ui/header';
import Footer from '../components/ui/footer';
import { getProductById } from '../lib/api';
import {
    ZoomIn, ZoomOut, Ruler, Box, LayoutGrid, List, Share,
    Minus, Plus, Info, ShoppingCart, Heart, ChevronRight,
    Star, Truck, RotateCcw, Wrench, ShieldCheck
} from 'lucide-react';

export default function ProductPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(100);
    const [userRating, setUserRating] = useState(0);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const finishingTabs = ['Màu sắc', 'Ván ép', 'Hiệu ứng vân gỗ'];
    const [activeFinishing, setActiveFinishing] = useState(finishingTabs[0]);

    const colors = [
        'bg-white border-2 border-gray-200',
        'bg-[#E5E4E0]',
        'bg-[#C6BAB0]',
        'bg-[#2A2A2A]',
        'bg-[#E4D5C7]',
        'bg-[#C69B7B]',
        'bg-[#7D886D]',
        'bg-[#DEDEDE]',
        'bg-[#38506D]',
    ];
    const [activeColor, setActiveColor] = useState(8);
    const [openIndex, setOpenIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await getProductById(id);
                setProduct(res.data);

                const apiWidth = res?.data?.variants?.specs?.dimensions?.width;
                const apiHeight = res?.data?.variants?.specs?.dimensions?.height;

                if (apiWidth) setWidth(apiWidth);
                if (apiHeight) setHeight(apiHeight);
            } catch (err) {
                setError(err.message || 'Không thể tải dữ liệu sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const productImages = useMemo(() => {
        const urls = product?.variants?.url;
        if (!Array.isArray(urls)) return [];
        return urls.filter((url) => typeof url === 'string' && url.trim() !== '' && !url.includes('example.com'));
    }, [product]);

    const averageRating = product?.average_rating || 4.9;
    const reviewCount = product?.review_count || 0;
    const reviews = product?.reviews || [];

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
            )
        },
        {
            icon: <Truck className="text-gray-600" size={24} />,
            title: "Sản xuất theo đơn đặt hàng",
            hasArrow: false
        },
        {
            icon: <RotateCcw className="text-gray-600" size={24} />,
            title: "Đổi trả miễn phí trong vòng 100 ngày",
            hasArrow: true
        },
        {
            icon: <Wrench className="text-gray-600" size={24} />,
            title: "Dịch vụ lắp ráp tùy chọn",
            hasArrow: true
        },
        {
            icon: <ShieldCheck className="text-gray-600" size={24} />,
            title: "Bảo hành 10 năm",
            hasArrow: true
        }
    ];

    const specs = [
        {
            title: "Kích thước & chi tiết",
            content: `Dài: ${product?.variants?.specs?.dimensions?.length || 'N/A'}cm • Rộng: ${product?.variants?.specs?.dimensions?.width || 'N/A'}cm • Cao: ${product?.variants?.specs?.dimensions?.height || 'N/A'}cm • Nặng: ${product?.variants?.specs?.weight || 'N/A'}kg`
        },
        {
            title: "Mô tả",
            content: product?.product_description || "Sản phẩm chưa có mô tả."
        },
        {
            title: "Vật liệu",
            content: `Chất liệu: ${product?.variants?.specs?.material || 'N/A'} • Màu sắc: ${product?.variants?.specs?.color || 'N/A'} • Tồn kho: ${product?.variants?.stock ?? 'N/A'}`
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-gray-900 font-sans">
                <Header />
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
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
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-red-600">
                    {error || 'Không tìm thấy sản phẩm'}
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
                    <h1 className="text-xl font-medium text-gray-500">{product.product_name}</h1>
                </header>

                <div className="flex flex-col lg:flex-row gap-8 mb-16 h-full min-h-[700px]">
                    <div className="flex-1 bg-[#F1F2F4] rounded-2xl relative border border-gray-200 overflow-hidden flex flex-col justify-between p-8">
                        <div className="absolute top-8 left-8 z-10 max-w-sm">
                            <p className="text-lg font-medium text-gray-800">
                                {product.product_name}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                {product?.variants?.specs?.material || 'Nội thất cao cấp'} • {product?.variants?.specs?.color || 'Màu tiêu chuẩn'}
                            </p>
                        </div>

                        {/* GIỮ NGUYÊN PHẦN ẢNH LỚN NÀY ĐỂ SAU LÀM 3D */}
                        <div className="flex-1 flex items-center justify-center relative w-full mt-12 mb-16">
                            <div
                                className="w-full max-w-2xl aspect-[16/9] bg-contain bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: "url('https://images.unsplash.com/photo-1595514535315-0f2c417cdeef?auto=format&fit=crop&q=80&w=1200')",
                                    filter: "hue-rotate(200deg) saturate(0.8) brightness(0.9)"
                                }}
                            />
                            <div
                                className="absolute left-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none bg-contain bg-left bg-no-repeat"
                                style={{ backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/101/101740.png')" }}
                            ></div>
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

                    <div className="w-full lg:w-[420px] flex flex-col pt-4">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-[28px] font-bold text-red-600">
                                {product?.variants?.price
                                    ? `${Number(product.variants.price).toLocaleString('vi-VN')} VNĐ`
                                    : 'Liên hệ'}
                            </span>
                            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-md">
                                {product.product_status}
                            </span>
                        </div>

                        <p className="text-xs text-gray-400 mb-4">
                            Màu: {product?.variants?.specs?.color || 'N/A'} • Chất liệu: {product?.variants?.specs?.material || 'N/A'} • Kho: {product?.variants?.stock ?? 'N/A'}
                        </p>

                        <div className="flex bg-gray-100 rounded-full p-1 mb-4">
                            <button className="flex-1 bg-white shadow-sm rounded-full py-2 text-sm font-medium text-gray-900">Hình thức</button>
                            <button className="flex-1 rounded-full py-2 text-sm font-medium text-gray-500 hover:text-gray-900">Chức năng</button>
                        </div>

                        <div className="h-px bg-gray-200 mb-4"></div>

                        <div className="space-y-4 mb-4">
                            <div className="pb-2">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm font-bold text-gray-900">Chiều rộng</span>
                                </div>
                                <div className="relative h-6 flex items-center mb-2 group">
                                    <div className="absolute w-full h-1 bg-gray-200 rounded-full"></div>
                                    <div
                                        className="absolute h-1 bg-red-600 rounded-full pointer-events-none transition-all duration-150"
                                        style={{ width: `${((width - 50) / 150) * 100}%` }}
                                    ></div>

                                    {[50, 100, 150, 200].map((val) => {
                                        const pos = ((val - 50) / 150) * 100;
                                        return (
                                            <div
                                                key={`w-tick-${val}`}
                                                className={`absolute w-2 h-2 rounded-full -ml-1 pointer-events-none transition-colors duration-150 ${val <= width ? 'bg-red-600' : 'bg-gray-300'}`}
                                                style={{ left: `${pos}%` }}
                                            />
                                        )
                                    })}

                                    <input
                                        type="range"
                                        min="50"
                                        max="200"
                                        step="50"
                                        value={width}
                                        onChange={(e) => setWidth(Number(e.target.value))}
                                        className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                                    />

                                    <div
                                        className="absolute top-[-36px] -ml-8 flex items-center justify-center w-16 h-8 bg-white border border-gray-200 shadow-sm rounded-full text-xs font-medium text-red-600 z-10 transition-all duration-150 pointer-events-none"
                                        style={{ left: `${((width - 50) / 150) * 100}%` }}
                                    >
                                        {width}cm
                                    </div>

                                    <div
                                        className="absolute w-4 h-4 bg-white border-2 border-red-600 rounded-full pointer-events-none z-10 transition-all duration-150 -ml-2"
                                        style={{ left: `${((width - 50) / 150) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="pt-2 pb-2">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm font-bold text-gray-900">Chiều cao</span>
                                </div>
                                <div className="relative h-6 flex items-center mb-2 group">
                                    <div className="absolute w-full h-1 bg-gray-200 rounded-full"></div>
                                    <div
                                        className="absolute h-1 bg-red-600 rounded-full pointer-events-none transition-all duration-150"
                                        style={{ width: `${((height - 50) / 150) * 100}%` }}
                                    ></div>

                                    {[50, 100, 150, 200].map((val) => {
                                        const pos = ((val - 50) / 150) * 100;
                                        return (
                                            <div
                                                key={`h-tick-${val}`}
                                                className={`absolute w-2 h-2 rounded-full -ml-1 pointer-events-none transition-colors duration-150 ${val <= height ? 'bg-red-600' : 'bg-gray-300'}`}
                                                style={{ left: `${pos}%` }}
                                            />
                                        )
                                    })}

                                    <input
                                        type="range"
                                        min="50"
                                        max="200"
                                        step="50"
                                        value={height}
                                        onChange={(e) => setHeight(Number(e.target.value))}
                                        className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                                    />

                                    <div
                                        className="absolute top-[-36px] -ml-8 flex items-center justify-center w-16 h-8 bg-white border border-gray-200 shadow-sm rounded-full text-xs font-medium text-red-600 z-10 transition-all duration-150 pointer-events-none"
                                        style={{ left: `${((height - 50) / 150) * 100}%` }}
                                    >
                                        {height}cm
                                    </div>

                                    <div
                                        className="absolute w-4 h-4 bg-white border-2 border-red-600 rounded-full pointer-events-none z-10 transition-all duration-150 -ml-2"
                                        style={{ left: `${((height - 50) / 150) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center pt-2">
                                <span className="text-sm font-bold text-gray-900 flex items-center gap-1 w-24">
                                    Hoàn thành <Info size={14} className="text-gray-400" />
                                </span>
                                <div className="flex bg-gray-100 rounded-full p-1 ml-auto shrink-0 border border-transparent hover:border-red-200 transition-colors">
                                    {finishingTabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveFinishing(tab)}
                                            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${activeFinishing === tab
                                                ? 'bg-white shadow-sm text-red-600'
                                                : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2">
                                <span className="text-sm font-bold text-gray-900 mb-3 block">Màu sắc</span>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {colors.map((colorClass, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveColor(i)}
                                            className={`w-8 h-8 rounded-full transition-all duration-200 ${colorClass} ${activeColor === i ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-110'
                                                }`}
                                            title={product?.variants?.specs?.color || 'Màu sản phẩm'}
                                        ></button>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Không thể quyết định?</span>
                                    <a href="#" className="font-medium text-gray-900 flex items-center gap-2 hover:underline">
                                        <Box size={16} /> Đặt hàng mẫu
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6">
                            <div className="flex gap-4 mb-4">
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full py-3.5 px-4 font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ShoppingCart size={20} />
                                    Thêm vào giỏ hàng
                                </button>
                                <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 rounded-full py-3.5 px-6 font-bold flex items-center justify-center gap-2 transition-colors">
                                    <Heart size={20} className="text-gray-400" />
                                    Lưu cấu hình
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 border-t border-gray-100 pt-4">
                                <div>
                                    Hàng được giao trong vòng 8 tuần
                                    <a href="#" className="font-bold text-gray-900 underline block mt-1">Xem thông tin thanh toán</a>
                                </div>
                                <div>
                                    Được sản xuất tại Việt Nam
                                    <a href="#" className="font-bold text-gray-900 underline block mt-1">Giao hàng & trả hàng</a>
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
                                    {feature.icon && (
                                        <div className="mt-0.5">{feature.icon}</div>
                                    )}
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
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 inline-block">Hình ảnh chi tiết sản phẩm</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
                    {productImages.length > 0 ? (
                        <>
                            <div className="md:col-span-2 md:row-span-2 h-[400px] md:h-full group overflow-hidden rounded-xl relative">
                                <img
                                    src={productImages[0]}
                                    alt={product.product_name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>

                            <div className="md:col-span-1 md:row-span-1 h-[250px] md:h-full group overflow-hidden rounded-xl relative">
                                {productImages[1] ? (
                                    <img
                                        src={productImages[1]}
                                        alt={product.product_name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                        Không có ảnh
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-1 md:row-span-1 grid grid-cols-2 gap-4 h-[200px] md:h-full">
                                <div className="group overflow-hidden rounded-xl relative">
                                    {productImages[2] ? (
                                        <img
                                            src={productImages[2]}
                                            alt={product.product_name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                            Không có ảnh
                                        </div>
                                    )}
                                </div>

                                <div className="group overflow-hidden rounded-xl relative">
                                    {productImages[3] ? (
                                        <img
                                            src={productImages[3]}
                                            alt={product.product_name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                            Không có ảnh
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="md:col-span-3 h-[400px] flex items-center justify-center text-gray-400 bg-gray-100 rounded-xl">
                            Không có ảnh sản phẩm
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
                                        <div className="pb-5 text-sm text-gray-600">
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
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setUserRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    size={24}
                                                    className={`transition-colors ${star <= userRating
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300 hover:text-yellow-400'
                                                        }`}
                                                    fill={star <= userRating ? 'currentColor' : 'none'}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Viết trải nghiệm của bạn về sản phẩm này..."
                                    className="flex-1 w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 min-h-[100px] resize-none"
                                ></textarea>
                                <div className="mt-4 flex justify-end">
                                    <button className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                                        Gửi đánh giá
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-2/3 border-2 border-gray-200 rounded-2xl p-4 sm:p-5 bg-white shadow-sm h-[310px]">
                            <div className="flex flex-col overflow-y-auto gap-3 snap-y snap-mandatory h-full pr-2" style={{ scrollbarWidth: 'thin' }}>
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.review_id} className="w-full shrink-0 h-auto p-4 snap-start border-2 border-gray-200 rounded-xl flex flex-col">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-bold text-sm text-gray-900">{review.username}</div>
                                                <div className="flex space-x-0.5 text-yellow-500">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={14}
                                                            fill={star <= review.rating ? "currentColor" : "none"}
                                                            className={star <= review.rating ? "" : "text-gray-300"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{review.review_comment}</p>
                                            <span className="text-xs text-gray-400 mt-2 block">
                                                {new Date(review.review_date).toLocaleDateString('vi-VN')}
                                            </span>
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