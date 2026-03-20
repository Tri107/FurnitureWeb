import {useState, useEffect} from "react";
import * as XLSX from "xlsx";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Label} from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getBrands,
  getCategories,
  getCollections,
  uploadProductImages,
  createVariant,
  createProduct,
} from "../../lib/api";

import {Loader2} from "lucide-react";
import toast from "react-hot-toast";

export default function AddProductModal({open, onClose, onProductAdded}) {
  const [form, setForm] = useState({
    product_name: "",
    product_description: "",
    product_status: "AVAILABLE",
    is_disabled: true,
    brand_id: "",
    category_id: "",
    collection_id: "",
    price: "",
    stock: "",
  });

  const [specFile, setSpecFile] = useState(null);
  const [images, setImages] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [specPreview, setSpecPreview] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandsData = await getBrands();
        const categoriesData = await getCategories();
        const collectionsData = await getCollections();

        setBrands(brandsData.data);
        setCategories(categoriesData.data);
        setCollections(collectionsData.data);

        console.log("Fetched brands:", brandsData);
        console.log("Fetched categories:", categoriesData);
        console.log("Fetched collections:", collectionsData);
      } catch (err) {
        console.error("Load data failed", err);
      }
    };

    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 3) {
      alert("Chỉ được upload tối đa 3 ảnh");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // tạo preview
    const previews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleSpecChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSpecFile(file);

    const ext = file.name.split(".").pop().toLowerCase();

    // TXT hoặc CSV
    if (ext === "txt" || ext === "csv") {
      const text = await file.text();

      const rows = text
        .split("\n")
        .map((r) => r.split(","))
        .filter((r) => r.length >= 2);

      setSpecPreview(rows);
    }

    // XLSX
    if (ext === "xlsx") {
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {type: "array"});

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const data = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
      });

      const rows = data.filter((r) => r.length >= 2);

      setSpecPreview(rows);
    }
  };

  // Convert specPreview rows to JSON (dynamic key-value)
  const specPreviewToJson = () => {
    const specs = {};
    specPreview.forEach(([key, val]) => {
      if (key && val) specs[String(key).trim()] = String(val).trim();
    });
    return specs;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      // === Bước 1: Upload images → lấy URLs ===
      let imageUrls = [];
      if (images.length > 0) {
        const uploadRes = await uploadProductImages(images);
        imageUrls = uploadRes.data.urls;
      }

      // === Bước 2: Tạo Variant (MongoDB) → lấy ObjectId ===
      const specs = specPreview.length > 0 ? specPreviewToJson() : {};

      const variantRes = await createVariant({
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        specs,
        url: imageUrls,
      });

      const variantRef = variantRes.data.variant_id;

      // === Bước 3: Tạo Product (MySQL) ===
      await createProduct({
        product_name: form.product_name,
        product_description: form.product_description,
        category_id: form.category_id,
        brand_id: form.brand_id,
        collection_id: form.collection_id,
        variant_ref: variantRef,
      });

      onClose();
      resetForm();
      toast.success("Thêm sản phẩm thành công!");
      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error("Thêm sản phẩm thất bại:", err);
      toast.error(err.message || "Có lỗi xảy ra khi thêm sản phẩm");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      product_name: "",
      product_description: "",
      product_status: "AVAILABLE",
      is_disabled: false,
      brand_id: "",
      category_id: "",
      collection_id: "",
      price: "",
      stock: "",
    });

    setImages([]);
    setImagePreview([]);
    setSpecFile(null);
    setSpecPreview([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Product name */}
            <div className="col-span-2">
              <Label className="mb-2 block">Tên sản phẩm</Label>
              <Input
                placeholder="Tên sản phẩm"
                onChange={(e) =>
                  setForm({...form, product_name: e.target.value})
                }
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <Label className="mb-2 block">Mô tả sản phẩm</Label>
              <Textarea
                placeholder="Mô tả sản phẩm"
                className="resize-none h-28"
                onChange={(e) =>
                  setForm({...form, product_description: e.target.value})
                }
              />
            </div>

            {/* Brand */}
            <div className="col-span-2">
              <Label className="mb-2 block">Nhãn hàng</Label>
              <Select
                value={form.brand_id}
                onValueChange={(v) => setForm({...form, brand_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.brand_id} value={String(b.brand_id)}>
                      {b.brand_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="col-span-2">
              <Label className="mb-2 block">Danh mục</Label>
              <Select
                value={form.category_id}
                onValueChange={(v) => setForm({...form, category_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem
                      key={c.category_id}
                      value={String(c.category_id)}>
                      {c.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Collection */}
            <div className="col-span-2">
              <Label className="mb-2 block">Bộ sưu tập</Label>
              <Select
                value={form.collection_id}
                onValueChange={(v) => setForm({...form, collection_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((c) => (
                    <SelectItem
                      key={c.collection_id}
                      value={String(c.collection_id)}>
                      {c.collection_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="col-span-1">
              <Label className="mb-2 block">Giá sản phẩm</Label>
              <Input
                type="number"
                placeholder="VD: 1500000"
                step={1000}
                min={0}
                value={form.price}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val < 0) {
                    toast.error("Giá không thể nhỏ hơn 0");
                    return;
                  }
                  setForm({...form, price: e.target.value});
                }}
              />
            </div>

            {/* Stock */}
            <div className="col-span-1">
              <Label className="mb-2 block">Tồn kho</Label>
              <Input
                type="number"
                placeholder="VD: 50"
                value={form.stock}
                onChange={(e) => setForm({...form, stock: e.target.value})}
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <label className="mb-2 block">Trạng thái hiển thị</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Switch
                        checked={form.is_disabled}
                        onCheckedChange={(v) =>
                          setForm({...form, is_disabled: v})
                        }
                      />
                    </div>
                  </TooltipTrigger>

                  <TooltipContent>
                    {form.is_disabled ? "Product active" : "Product disabled"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Spec upload */}
            <div className="col-span-2">
              <Label className="mb-2 block">File đặc tả</Label>

              <Input
                type="file"
                accept=".txt,.csv,.xlsx"
                onChange={handleSpecChange}
              />

              <p className="text-sm text-muted-foreground">
                Upload file specs (.csv, .txt, .xlsx)
              </p>
            </div>

            {/* Image upload */}
            <div className="col-span-2">
              <Label className="mb-2 block">Hình ảnh sản phẩm</Label>

              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />

              <p className="text-sm text-muted-foreground">
                Upload product images (.jpg, .jpeg, .png)
              </p>
            </div>

            {/* Image preview */}
            {imagePreview.length > 0 && (
              <div className="col-span-2 flex gap-3 flex-wrap">
                {imagePreview.map((src, i) => (
                  <div key={i} className="relative">
                    <img
                      src={src}
                      className="w-24 h-24 object-cover rounded border"
                    />

                    <button
                      className="absolute top-0 right-0 bg-black text-white text-xs px-1"
                      onClick={() => {
                        const newImages = images.filter((_, idx) => idx !== i);
                        const newPreview = imagePreview.filter(
                          (_, idx) => idx !== i,
                        );

                        setImages(newImages);
                        setImagePreview(newPreview);
                      }}>
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Spec preview */}
            {specPreview.length > 0 && (
              <div className="col-span-2 border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Thông số kỹ thuật</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                    setSpecFile(null);
                    setSpecPreview([]);
                  }}>
                  Clear
                </Button>
                </div>
                <table className="w-full text-sm border">
                  <tbody>
                    {specPreview.map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2 font-medium">{row[0]}</td>
                        <td className="p-2 whitespace-pre-wrap">
                          {String(row[1]).includes(",")
                            ? String(row[1])
                                .split(",")
                                .map((v) => v.trim())
                                .join("\n")
                            : row[1]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Submit */}
            <div className="col-span-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Lưu sản phẩm"
                )}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
