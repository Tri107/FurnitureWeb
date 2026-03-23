import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Search, Eye } from "lucide-react";
import { useEffect, useState } from "react";

import AddProductModal from "../../components/ui/AddProductModal";
import ViewProductModal from "../../components/ui/ViewProductModal";

import { getProducts } from "../../lib/api";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewProductId, setViewProductId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();

      const formatted = res.data.map((item) => ({
        id: item.product_id,
        name: item.product_name,
        price: item.variants?.price,
        stock: item.variants?.stock,
        image: item.variants?.url?.[0],
      }));

      setProducts(formatted);
    } catch (err) {
      console.error("Load products failed", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold">Trang sản phẩm</h1>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Thêm sản phẩm
        </Button>

        <div className="relative w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input placeholder="Tìm kiếm..." className="pl-9 bg-white" />
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr className="text-left">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Sản phẩm</th>
                <th className="px-6 py-4 font-medium">Giá</th>
                <th className="px-6 py-4 font-medium">Tồn kho</th>
                <th className="px-6 py-4 text-right font-medium">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-b-0 hover:bg-muted/20"
                >
                  <td className="px-6 py-4">{item.id}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium">{item.price}đ</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                                                ${
                                                  item.stock <= 20
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-green-100 text-green-600"
                                                }`}
                    >
                      {item.stock}
                    </span>
                  </td>

                    <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                        onClick={() => {
                          setViewProductId(item.id);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye size={14} />
                        Xem
                      </Button>

                      <Button
                        size="sm"
                        className="bg-yellow-400 hover:bg-yellow-500 text-white flex items-center gap-1"
                      >
                        <Pencil size={14} />
                        Sửa
                      </Button>

                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <AddProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={fetchProducts}
      />
      <ViewProductModal
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewProductId(null);
        }}
        productId={viewProductId}
      />
    </div>
  );
}
