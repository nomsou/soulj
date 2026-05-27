"use client";

import { ProductCard } from "./ProductCard";
import { useCart } from "@/store/cart";

type Product = {
  id: string;
  name: string;
  slug: string;
  color: string;
  size: string;
  priceNGN: number;
  priceUSD: number;
  images: string[];
};

export function ProductGrid({ products }: { products: Product[] }) {
  const { currency, setCurrency } = useCart();

  if (products.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-32 gap-4"
        style={{ color: "var(--muted)" }}
      >
        <p className="text-xs tracking-[0.25em] uppercase">No products yet</p>
      </div>
    );
  }

  return (
    <div>
      {/* currency toggle */}
      <div className="flex items-center gap-3 mb-10">
        <p
          className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--muted)" }}
        >
          Currency
        </p>
        {(["NGN", "USD"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className="text-xs tracking-[0.15em] uppercase px-3 py-1 border transition-all duration-200"
            style={{
              borderColor: currency === c ? "var(--body)" : "var(--muted)",
              color: currency === c ? "var(--body)" : "var(--muted)",
              background: currency === c ? "var(--body)" : "transparent",
              ...(currency === c && { color: "var(--page)" }),
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
