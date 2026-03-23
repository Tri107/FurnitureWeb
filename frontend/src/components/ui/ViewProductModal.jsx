import {useState, useEffect} from "react";

import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getProductById,
  getBrands,
  getCategories,
  getCollections,
} from "../../lib/api";

export default function ViewProductModal({open, onClose, productId}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch lookup data (brands, categories, collections)
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [brandsRes, categoriesRes, collectionsRes] = await Promise.all([
          getBrands(),
          getCategories(),
          getCollections(),
        ]);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
        setCollections(collectionsRes.data);
      } catch (err) {
        console.error("Load lookup data failed", err);
      }
    };
    fetchLookups();
  }, []);

  // Fetch product detail when modal opens
  useEffect(() => {
    if (!open || !productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductById(productId);
        setProduct(res.data);
      } catch (err) {
        console.error("Load product failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [open, productId]);

  // Reset on close
  const handleClose = () => {
    setProduct(null);
    setPreviewImage(null);
    onClose();
  };

  // Helper: find name by id
  const getBrandName = (id) =>
    brands.find((b) => b.brand_id === id)?.brand_name || id;
  const getCategoryName = (id) =>
    categories.find((c) => c.category_id === id)?.category_name || id;
  const getCollectionName = (id) =>
    collections.find((c) => c.collection_id === id)?.collection_name || id;

  // Build specs table data from variant.specs (dynamic)
  const getSpecRows = () => {
    if (!product?.variants?.specs) return [];
    const {specs} = product.variants;
    const rows = [];

    Object.entries(specs).forEach(([key, value]) => {
      if (value != null && value !== "") {
        const strVal = String(value);
        rows.push([
          key,
          strVal.includes(",")
            ? strVal.split(",").map(v => v.trim()).join("\n")
            : strVal,
        ]);
      }
    });

    return rows;
  };

  return (
    <>
      {/* Main View Modal */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : product ? (
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                {/* ===== Basic Info ===== */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground text-xs">
                      Tên sản phẩm
                    </Label>
                    <p className="text-lg font-semibold mt-1">
                      {product.product_name}
                    </p>
                  </div>

                  {product.product_description && (
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Mô tả
                      </Label>
                      <p className="mt-1 text-sm whitespace-pre-wrap">
                        {product.product_description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Nhãn hàng
                      </Label>
                      <p className="mt-1 text-sm font-medium">
                        {getBrandName(product.brand_id)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Danh mục
                      </Label>
                      <p className="mt-1 text-sm font-medium">
                        {getCategoryName(product.category_id)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Bộ sưu tập
                      </Label>
                      <p className="mt-1 text-sm font-medium">
                        {getCollectionName(product.collection_id)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Trạng thái
                      </Label>
                      <div className="mt-1">
                        <Badge
                          variant={
                            product.is_disabled ? "destructive" : "default"
                          }>
                          {product.is_disabled ? "Đã ẩn" : "Đang hiển thị"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ===== Price & Stock ===== */}
                {product.variants && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Giá
                      </Label>
                      <p className="mt-1 text-lg font-bold text-primary">
                        {Number(product.variants.price).toLocaleString("vi-VN")}
                        đ
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Tồn kho
                      </Label>
                      <p className="mt-1 text-lg font-bold">
                        {product.variants.stock}
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* ===== Images ===== */}
                {product.variants?.url && product.variants.url.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground text-xs mb-3 block">
                      Hình ảnh sản phẩm
                    </Label>
                    <div className="flex gap-3 flex-wrap">
                      {product.variants.url.map((src, i) => (
                        <div
                          key={i}
                          className="cursor-pointer rounded-lg overflow-hidden border hover:ring-2 hover:ring-primary transition-all"
                          onClick={() => setPreviewImage(src)}>
                          <img
                            src={src}
                            alt={`Product image ${i + 1}`}
                            className="w-28 h-28 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* ===== Specs Table ===== */}
                {getSpecRows().length > 0 && (
                  <div>
                    <Label className="text-muted-foreground text-xs mb-3 block">
                      Thông số kỹ thuật
                    </Label>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">
                              Thông số
                            </TableHead>
                            <TableHead>Giá trị</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getSpecRows().map(([label, value], i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">
                                {label}
                              </TableCell>
                              <TableCell className="whitespace-pre-wrap">{value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Không tìm thấy sản phẩm
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Popup */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent
          className="max-w-3xl p-2 bg-black/90 border-none"
          showCloseButton={true}>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
