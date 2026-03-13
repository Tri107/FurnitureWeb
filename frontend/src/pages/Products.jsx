import { useMemo, useState } from "react"

import Header from "@/components/ui/header"
import Footer from "@/components/ui/footer"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

export default function Products() {

  const products = useMemo(() => [
    {
      id: "p1",
      name: "Sofa Vải Nỉ Bắc Âu",
      price: 8500000,
      oldPrice: 10500000,
      category: "living",
      tag: "Mới",
      rating: 5,
      reviews: 24,
      img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200"
    },
    {
      id: "p2",
      name: "Ghế Armchair Da Thật",
      price: 4200000,
      category: "living",
      tag: "Hot",
      rating: 5,
      reviews: 18,
      img: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=1200"
    },
    {
      id: "p3",
      name: "Bàn Trà Gỗ Sồi",
      price: 2800000,
      oldPrice: 3200000,
      category: "living",
      tag: "-12%",
      rating: 4,
      reviews: 12,
      img: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=1200"
    },
    {
      id: "p4",
      name: "Kệ Sách Modern",
      price: 3600000,
      category: "decor",
      rating: 5,
      reviews: 21,
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200"
    },
    {
      id: "p5",
      name: "Giường Ngủ King Size",
      price: 12900000,
      oldPrice: 14900000,
      category: "bedroom",
      tag: "-13%",
      rating: 4,
      reviews: 9,
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
    },
    {
      id: "p6",
      name: "Bộ Bàn Ăn 6 Ghế",
      price: 15900000,
      category: "dining",
      rating: 5,
      reviews: 33,
      img: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200"
    },
    {
      id: "p7",
      name: "Đèn Trang Trí",
      price: 1850000,
      oldPrice: 2100000,
      category: "decor",
      tag: "-12%",
      rating: 4,
      reviews: 14,
      img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200"
    },
    {
      id: "p8",
      name: "Ghế Thư Giãn",
      price: 3100000,
      category: "living",
      rating: 5,
      reviews: 26,
      img: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=1200"
    }
  ], [])


  const [sort, setSort] = useState("default")
  const [categories, setCategories] = useState([])
  const [priceRange, setPriceRange] = useState([0, 20000000])


  function toggleCategory(cat) {

    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat))
    } else {
      setCategories([...categories, cat])
    }

  }


  const filteredProducts = useMemo(() => {

    let list = [...products]

    if (categories.length > 0) {
      list = list.filter(p => categories.includes(p.category))
    }

    list = list.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    )

    if (sort === "asc") list.sort((a,b)=>a.price-b.price)
    if (sort === "desc") list.sort((a,b)=>b.price-a.price)

    return list

  }, [products, categories, priceRange, sort])


  return (
    <div className="flex flex-col min-h-screen bg-white">

      <Header/>

      <main className="flex-1 bg-slate-50 py-10">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h1 className="text-xl font-semibold">
                Tất Cả Sản Phẩm
              </h1>

              <p className="text-sm text-slate-500">
                Hiển thị {filteredProducts.length} sản phẩm
              </p>
            </div>


            <select
              value={sort}
              onChange={(e)=>setSort(e.target.value)}
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

                  <div>

                    <h3 className="font-semibold mb-3">
                      Danh mục
                    </h3>

                    <div className="space-y-2 text-sm">

                      <label className="flex items-center gap-2">
                        <Checkbox onCheckedChange={()=>toggleCategory("living")}/>
                        Phòng khách
                      </label>

                      <label className="flex items-center gap-2">
                        <Checkbox onCheckedChange={()=>toggleCategory("bedroom")}/>
                        Phòng ngủ
                      </label>

                      <label className="flex items-center gap-2">
                        <Checkbox onCheckedChange={()=>toggleCategory("dining")}/>
                        Phòng ăn
                      </label>

                      <label className="flex items-center gap-2">
                        <Checkbox onCheckedChange={()=>toggleCategory("decor")}/>
                        Trang trí
                      </label>

                    </div>

                  </div>


                  {/* PRICE */}

                  <div>

                    <h3 className="font-semibold mb-3">
                      Khoảng giá
                    </h3>

                    <Slider
                      min={0}
                      max={20000000}
                      step={500000}
                      value={priceRange}
                      onValueChange={(v)=>setPriceRange(v)}
                    />


                    <div className="flex gap-3 mt-4">

                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e)=>setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full border rounded px-2 py-1 text-xs"
                      />

                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e)=>setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full border rounded px-2 py-1 text-xs"
                      />

                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      {formatVND(priceRange[0])} - {formatVND(priceRange[1])}
                    </p>

                  </div>

                </CardContent>

              </Card>

            </aside>


            {/* PRODUCT GRID */}

            <section className="col-span-9">

              <div className="grid grid-cols-3 gap-6">

                {filteredProducts.map((p)=>(
                  
                  <div
                    key={p.id}
                    className="rounded-xl bg-white border border-slate-200 overflow-hidden"
                  >

                    <div className="relative">

                      <div className="aspect-[4/3] bg-slate-100">

                        <img
                          src={p.img}
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


                      <div className="mt-1 flex items-center gap-1">

                        {Array.from({length:5}).map((_,i)=>(
                          <span
                            key={i}
                            className={
                              i<p.rating
                              ?"text-yellow-400 text-xs"
                              :"text-slate-300 text-xs"
                            }
                          >
                            ★
                          </span>
                        ))}

                        <span className="text-xs text-slate-500 ml-1">
                          ({p.reviews})
                        </span>

                      </div>


                      <div className="mt-2">

                        <p className="text-sm font-bold">
                          {formatVND(p.price)}
                        </p>

                        {p.oldPrice && (
                          <p className="text-xs text-slate-400 line-through">
                            {formatVND(p.oldPrice)}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                ))}

              </div>


              <div className="flex justify-center mt-8 gap-2">

                <Button variant="outline" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>

              </div>

            </section>

          </div>

        </div>

      </main>

      <Footer/>

    </div>
  )
}


function formatVND(v){

  return new Intl.NumberFormat("vi-VN",{
    style:"currency",
    currency:"VND",
    maximumFractionDigits:0
  }).format(v)

}