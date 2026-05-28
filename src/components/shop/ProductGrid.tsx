"use client";

import { ProductCard } from "./ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  color: string;
  size: string;
  priceNGN: number;
  images: string[];
  stock: number;
};

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-32"
        style={{ color: "var(--muted)" }}
      >
        <p className="text-xs tracking-[0.25em] uppercase">No products yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
