import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { getProducts } from "@/lib/api";

export default function Products() {
  const [searchParams] = useSearchParams();

  const selectedCategoryFromUrl = searchParams.get("category") || "";
  const selectedCollectionFromUrl = searchParams.get("collection") || "";

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  const [sort, setSort] = useState("default");

  const [selectedCategories, setSelectedCategories] = useState(
    selectedCategoryFromUrl ? [selectedCategoryFromUrl] : []
  );

  const [selectedBrands, setSelectedBrands] = useState([]);

  const [selectedCollections, setSelectedCollections] = useState(
    selectedCollectionFromUrl ? [selectedCollectionFromUrl] : []
  );

  const [priceRange, setPriceRange] = useState([0, 20000000]);

  useEffect(() => {
    if (selectedCategoryFromUrl) {
      setSelectedCategories([selectedCategoryFromUrl]);
    } else {
      setSelectedCategories([]);
    }
  }, [selectedCategoryFromUrl]);

  useEffect(() => {
    if (selectedCollectionFromUrl) {
      setSelectedCollections([selectedCollectionFromUrl]);
    } else {
      setSelectedCollections([]);
    }
  }, [selectedCollectionFromUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductError("");

        const res = await getProducts();

        const mappedProducts = (res?.data || []).map((item, index) => ({
          id: item.product_id,
          name: item.product_name,
          price: item?.variants?.price || 0,
          oldPrice: null,
          categoryName: item.category_name || "",
          brandName: item.brand_name || "",
          collectionName: item.collection_name || "",
          tag: index % 3 === 0 ? "Mới" : index % 3 === 1 ? "Hot" : null,
          rating: 5,
          reviews: 0,
          img:
            item?.variants?.url?.[0] ||
            "https://via.placeholder.com/600x400?text=No+Image",
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        setProductError(error.message || "Không thể tải sản phẩm");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  function toggleCategory(categoryName) {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== categoryName)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  }

  function toggleBrand(brandName) {
    if (selectedBrands.includes(brandName)) {
      setSelectedBrands(selectedBrands.filter((item) => item !== brandName));
    } else {
      setSelectedBrands([...selectedBrands, brandName]);
    }
  }

  function toggleCollection(collectionName) {
    if (selectedCollections.includes(collectionName)) {
      setSelectedCollections(
        selectedCollections.filter((item) => item !== collectionName)
      );
    } else {
      setSelectedCollections([...selectedCollections, collectionName]);
    }
  }

  const categoryOptions = useMemo(() => {
    return [...new Set(products.map((p) => p.categoryName).filter(Boolean))];
  }, [products]);

  const brandOptions = useMemo(() => {
    return [...new Set(products.map((p) => p.brandName).filter(Boolean))];
  }, [products]);

  const collectionOptions = useMemo(() => {
    return [...new Set(products.map((p) => p.collectionName).filter(Boolean))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.categoryName));
    }

    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brandName));
    }

    if (selectedCollections.length > 0) {
      list = list.filter((p) =>
        selectedCollections.includes(p.collectionName)
      );
    }

    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    if (sort === "desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [
    products,
    selectedCategories,
    selectedBrands,
    selectedCollections,
    priceRange,
    sort,
  ]);

  const filterSummary = useMemo(() => {
    if (loadingProducts) return "Đang tải sản phẩm...";
    if (productError) return "Không thể tải sản phẩm";

    if (selectedCategoryFromUrl) {
      return `Danh mục: ${selectedCategoryFromUrl} • ${filteredProducts.length} sản phẩm`;
    }

    if (selectedCollectionFromUrl) {
      return `Collection: ${selectedCollectionFromUrl} • ${filteredProducts.length} sản phẩm`;
    }

    return `Hiển thị ${filteredProducts.length} sản phẩm`;
  }, [
    loadingProducts,
    productError,
    selectedCategoryFromUrl,
    selectedCollectionFromUrl,
    filteredProducts.length,
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4">

          {/* TITLE */}

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-semibold">Tất Cả Sản Phẩm</h1>
              <p className="text-sm text-slate-500">{filterSummary}</p>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="default">Mặc định</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
          </div>

          <div className="grid grid-cols-12 gap-8">

            {/* FILTER */}

            <aside className="col-span-3">
              <Card>
                <CardContent className="p-6 space-y-6">

                  {/* CATEGORY */}

                  <div>
                    <h3 className="font-semibold mb-3">Danh mục</h3>

                    <div className="space-y-2 text-sm">
                      {categoryOptions.map((categoryName) => (
                        <label key={categoryName} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedCategories.includes(categoryName)}
                            onCheckedChange={() =>
                              toggleCategory(categoryName)
                            }
                          />
                          {categoryName}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* BRAND */}

                  <div>
                    <h3 className="font-semibold mb-3">Thương hiệu</h3>

                    <div className="space-y-2 text-sm">
                      {brandOptions.map((brandName) => (
                        <label key={brandName} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedBrands.includes(brandName)}
                            onCheckedChange={() =>
                              toggleBrand(brandName)
                            }
                          />
                          {brandName}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* COLLECTION */}

                  <div>
                    <h3 className="font-semibold mb-3">Collection</h3>

                    <div className="space-y-2 text-sm">
                      {collectionOptions.map((collectionName) => (
                        <label key={collectionName} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedCollections.includes(collectionName)}
                            onCheckedChange={() =>
                              toggleCollection(collectionName)
                            }
                          />
                          {collectionName}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* PRICE */}

                  <div>
                    <h3 className="font-semibold mb-3">Khoảng giá</h3>

                    <Slider
                      min={0}
                      max={20000000}
                      step={500000}
                      value={priceRange}
                      onValueChange={(v) => setPriceRange(v)}
                    />

                    <p className="text-xs text-slate-500 mt-2">
                      {formatVND(priceRange[0])} - {formatVND(priceRange[1])}
                    </p>
                  </div>

                </CardContent>
              </Card>
            </aside>

            {/* PRODUCT GRID */}

            <section className="col-span-9">

              {loadingProducts ? (
                <div className="bg-white border rounded-xl p-10 text-center text-slate-500">
                  Đang tải sản phẩm...
                </div>
              ) : productError ? (
                <div className="bg-white border rounded-xl p-10 text-center text-red-500">
                  {productError}
                </div>
              ) : (

                <div className="grid grid-cols-3 gap-6">

                  {filteredProducts.map((p) => (

                    <Link
                      key={p.id}
                      to={`/detailproduct/${p.id}`}
                      className="block rounded-xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition"
                    >

                      <div className="relative">

                        <div className="aspect-[4/3] bg-slate-100">

                          <img
                            src={p.img}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />

                        </div>

                        {p.tag && (
                          <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                            {p.tag}
                          </span>
                        )}

                      </div>

                      <div className="p-3">

                        <p className="text-sm font-semibold line-clamp-2">
                          {p.name}
                        </p>

                        <div className="mt-2">
                          <p className="text-sm font-bold">
                            {formatVND(p.price)}
                          </p>
                        </div>

                        <div className="mt-2 text-xs text-slate-500 space-y-1">
                          {p.categoryName && <p>Danh mục: {p.categoryName}</p>}
                          {p.brandName && <p>Thương hiệu: {p.brandName}</p>}
                          {p.collectionName && <p>Collection: {p.collectionName}</p>}
                        </div>

                      </div>

                    </Link>

                  ))}

                </div>

              )}

            </section>

          </div>
        </div>
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