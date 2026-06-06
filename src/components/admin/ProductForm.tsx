"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const LOOKBOOK_ASSETS = [
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_1.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_2.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_3.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_4.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_5.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_6.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_7.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_8.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_9.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_10.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_11.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_12.jpg",
  "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/sleeve.jpg",
];

type ProductData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  priceNGN: number;
  color: string;
  size: string;
  stock: number;
  images: string[];
  published: boolean;
};

export function ProductForm({ initial }: { initial?: Partial<ProductData> }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<ProductData>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    priceNGN: initial?.priceNGN ?? 0,
    color: initial?.color ?? "Black",
    size: initial?.size ?? "M",
    stock: initial?.stock ?? 0,
    images: initial?.images ?? [],
    published: initial?.published ?? false,
    id: initial?.id,
  });

  const [loading, setLoading] = useState(false);

  const set = <K extends keyof ProductData>(key: K, val: ProductData[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
  };

  const autoSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const makeCover = (url: string) => {
    setForm((prev) => ({
      ...prev,
      images: [url, ...prev.images.filter((img) => img !== url)],
    }));
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  const toggleLookbookImage = (url: string) => {
    setForm((prev) => {
      const exists = prev.images.includes(url);
      return {
        ...prev,
        images: exists
          ? prev.images.filter((img) => img !== url)
          : [...prev.images, url],
      };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const url = isEdit ? `/api/products/${initial!.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...form,
      priceNGN: Number(form.priceNGN),
      stock: Number(form.stock),
      images: [...form.images],
    };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    router.push("/admin/products");
    router.refresh();
  };

  const inputCls =
    "w-full px-3 py-2.5 text-sm outline-none border text-[#0D0D0A] bg-[#FAFAF5]";

  const inputStyle = { borderColor: "#D5D2BF" };

  const labelCls =
    "block text-[10px] tracking-[0.1em] uppercase mb-1.5 text-[#3D4A28]";

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-xl font-medium mb-8" style={{ color: "#0D0D0A" }}>
        {isEdit ? "Edit product" : "New product"}
      </h1>

      <div className="space-y-5">
        <div>
          <label className={labelCls}>Name</label>
          <input
            className={inputCls}
            style={inputStyle}
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
                slug: autoSlug(e.target.value),
              }));
            }}
          />
        </div>

        <div>
          <label className={labelCls}>Slug</label>
          <input
            className={inputCls}
            style={inputStyle}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            className={inputCls}
            style={inputStyle}
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div>
          <label className={labelCls}>Price (NGN)</label>
          <input
            type="number"
            className={inputCls}
            style={inputStyle}
            value={form.priceNGN || ""}
            onChange={(e) => set("priceNGN", Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Colour</label>
            <select
              className={inputCls}
              style={inputStyle}
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
            >
              {/* Added standard normalized case support to match your db */}
              <option value="Black">Black</option>
              <option value="White">White</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Size</label>
            <select
              className={inputCls}
              style={inputStyle}
              value={form.size}
              onChange={(e) => set("size", e.target.value)}
            >
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Stock</label>
          <input
            type="number"
            className={inputCls}
            style={inputStyle}
            value={form.stock}
            onChange={(e) => set("stock", Number(e.target.value))}
          />
        </div>

        <div>
          <label className={labelCls}>Product images (first is cover)</label>

          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {form.images.map((url, i) => {
                const isCover = i === 0;

                return (
                  <div key={url} className="relative w-20 h-24">
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/60"
                    >
                      <X size={10} color="white" />
                    </button>

                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={() => makeCover(url)}
                        className="absolute bottom-1 left-1 text-[9px] px-1 py-0.5 bg-black/70 text-white"
                      >
                        Make cover
                      </button>
                    )}

                    {isCover && (
                      <div className="absolute top-1 left-1 text-[9px] px-1 py-0.5 bg-green-600 text-white">
                        Cover
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="block text-[10px] tracking-[0.05em] uppercase mb-2 text-[#3D4A28]/70">
            Select Lookbook Images to link to this product:
          </div>

          <div
            className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 bg-[#FAFAF5]"
            style={{ border: "1px solid #D5D2BF" }}
          >
            {LOOKBOOK_ASSETS.map((url, i) => {
              const isSelected = form.images.includes(url);
              return (
                <div
                  key={url}
                  onClick={() => toggleLookbookImage(url)}
                  className={`relative aspect-[3/4] cursor-pointer bg-black overflow-hidden transition-all ${
                    isSelected
                      ? "ring-2 ring-[#0D0D0A] scale-[0.95]"
                      : "opacity-40 hover:opacity-100"
                  }`}
                >
                  <img
                    src={url}
                    alt={`Lookbook ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#0D0D0A] text-white flex items-center justify-center text-[8px]">
                      ✓
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-[8px] text-center text-white py-0.5 font-mono">
                    L-{i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-sm" style={{ color: "#0D0D0A" }}>
            Published
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 text-sm tracking-[0.15em] uppercase font-medium"
            style={{ background: "#0D0D0A", color: "#E8E2C8" }}
          >
            {loading ? "Saving..." : isEdit ? "Save changes" : "Create"}
          </button>

          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-sm tracking-[0.15em] uppercase border"
            style={{ borderColor: "#D5D2BF", color: "#3D4A28" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
