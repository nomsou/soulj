"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const inputStyle = {
    background: "transparent",
    borderColor: "var(--card)",
    color: "var(--body)",
  };

  const labelStyle = {
    color: "var(--muted)",
  };

  const field = (
    label: string,
    key: keyof ProductData,
    type = "text",
    opts?: { step?: string },
  ) => (
    <div className="space-y-1.5">
      <label className="text-xs tracking-[0.12em] uppercase" style={labelStyle}>
        {label}
      </label>
      <input
        type={type}
        value={form[key] as string | number}
        step={opts?.step}
        onChange={(e) => {
          const val =
            type === "number" ? parseFloat(e.target.value) : e.target.value;
          set(key, val);
          if (key === "name") set("slug", autoSlug(e.target.value));
        }}
        className="w-full px-4 py-3 text-sm outline-none border"
        style={inputStyle}
      />
    </div>
  );

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-xl font-medium mb-8" style={{ color: "var(--body)" }}>
        {isEdit ? "Edit product" : "New product"}
      </h1>

      <div className="space-y-5">
        {field("Name", "name")}
        {field("Slug (auto-generated)", "slug")}

        <div className="space-y-1.5">
          <label
            className="text-xs tracking-[0.12em] uppercase"
            style={labelStyle}
          >
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 text-sm outline-none border resize-none"
            style={inputStyle}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {field("Price (NGN)", "priceNGN", "number")}
          {field("Price (USD)", "priceUSD", "number")}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              className="text-xs tracking-[0.12em] uppercase"
              style={labelStyle}
            >
              Colour
            </label>
            <select
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              className="w-full px-4 py-3 text-sm outline-none border"
              style={inputStyle}
            >
              <option>Black</option>
              <option>White</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs tracking-[0.12em] uppercase"
              style={labelStyle}
            >
              Size
            </label>
            <select
              value={form.size}
              onChange={(e) => set("size", e.target.value)}
              className="w-full px-4 py-3 text-sm outline-none border"
              style={inputStyle}
            >
              <option>M</option>
              <option>S</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
        </div>

        {field("Stock", "stock", "number")}

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
            style={{ color: "var(--body)" }}
          >
            Published (visible on storefront)
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 text-sm tracking-[0.15em] uppercase font-medium transition-all disabled:opacity-50"
            style={{ background: "var(--body)", color: "var(--page)" }}
          >
            {loading ? "Saving..." : isEdit ? "Save changes" : "Create product"}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-sm tracking-[0.15em] uppercase border transition-all"
            style={{ borderColor: "var(--card)", color: "var(--muted)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
