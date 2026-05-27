"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { X } from "lucide-react";

type ProductData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  priceNGN: number;
  priceUSD: number;
  color: string;
  size: string;
  stock: number;
  images: string[];
  published: boolean;
};

export function ProductForm({ initial }: { initial?: ProductData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<ProductData>(
    initial ?? {
      name: "",
      slug: "",
      description: "",
      priceNGN: 0,
      priceUSD: 0,
      color: "Black",
      size: "M",
      stock: 0,
      images: [],
      published: false,
    },
  );
  const [loading, setLoading] = useState(false);

  const set = (key: keyof ProductData, val: any) =>
    setForm((p) => ({ ...p, [key]: val }));

  const autoSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const handleSubmit = async () => {
    setLoading(true);
    const url = isEdit ? `/api/products/${initial!.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
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
              set("name", e.target.value);
              set("slug", autoSlug(e.target.value));
            }}
          />
        </div>

        <div>
          <label className={labelCls}>Slug (auto-generated)</label>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Price (NGN)</label>
            <input
              type="number"
              className={inputCls}
              style={inputStyle}
              value={form.priceNGN}
              onChange={(e) => set("priceNGN", parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls}>Price (USD)</label>
            <input
              type="number"
              className={inputCls}
              style={inputStyle}
              value={form.priceUSD}
              onChange={(e) => set("priceUSD", parseFloat(e.target.value))}
            />
          </div>
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
              <option>Black</option>
              <option>White</option>
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
            onChange={(e) => set("stock", parseInt(e.target.value))}
          />
        </div>

        {/* Image upload */}
        <div>
          <label className={labelCls}>Product images (first = cover)</label>

          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-20 h-24">
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "images",
                        form.images.filter((_, j) => j !== i),
                      )
                    }
                    className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/60"
                    aria-label="Remove image"
                  >
                    <X size={10} color="white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <CldUploadWidget
            uploadPreset={
              process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? ""
            }
            onSuccess={(result: any) => {
              const url = result?.info?.secure_url;
              if (url) set("images", [...form.images, url]);
            }}
            options={{ multiple: true, maxFiles: 5, resourceType: "image" }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="px-4 py-2.5 text-xs tracking-[0.12em] uppercase border transition-all"
                style={{ borderColor: "#D5D2BF", color: "#3D4A28" }}
              >
                Upload images
              </button>
            )}
          </CldUploadWidget>

          <p className="text-[11px] mt-1.5" style={{ color: "#3D4A28" }}>
            Up to 5 images. Stored on Cloudinary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="w-4 h-4"
          />
          <label
            htmlFor="published"
            className="text-sm"
            style={{ color: "#0D0D0A" }}
          >
            Published (visible on storefront)
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 text-sm tracking-[0.15em] uppercase font-medium transition-all disabled:opacity-50"
            style={{ background: "#0D0D0A", color: "#E8E2C8" }}
          >
            {loading ? "Saving..." : isEdit ? "Save changes" : "Create product"}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-sm tracking-[0.15em] uppercase border transition-all"
            style={{ borderColor: "#D5D2BF", color: "#3D4A28" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
