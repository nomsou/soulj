"use client";

import { Lock } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { formatNGN } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  color: string;
  size: string;
  priceNGN: number;
  images: string[];
  stock: number;
  published: boolean;
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
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14 max-w-full">
        {products.map((p) => {
          const isLocked = !p.published;

          if (isLocked) {
            return (
              <div
                key={p.id}
                className="space-y-3 opacity-80 cursor-not-allowed select-none group"
              >
                <div
                  className="aspect-[3/4] relative overflow-hidden flex flex-col items-center justify-center transition-all duration-500"
                  style={{
                    background:
                      p.color.toLowerCase() === "black"
                        ? "var(--card-dark)"
                        : "var(--card)",
                  }}
                >
                  {p.images && p.images[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-50 group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 animate-pulse bg-black/10 dark:bg-white/5" />
                  )}

                  <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[1px] transition-all group-hover:backdrop-blur-[2px]" />

                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Lock size={18} strokeWidth={1.5} className="text-white" />
                    <span className="text-[9px] tracking-[0.3em] uppercase font-bold px-2 py-0.5 bg-white text-black">
                      Coming Soon
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--body)" }}
                  >
                    {p.name}
                  </p>
                  <p
                    className="text-sm line-through opacity-40"
                    style={{ color: "var(--muted)" }}
                  >
                    {formatNGN(p.priceNGN)}
                  </p>
                </div>

                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "var(--muted)" }}
                >
                  {p.color} — Drop 002
                </p>
              </div>
            );
          }

          return <ProductCard key={p.id} product={p} />;
        })}
      </div>
    </div>
  );
}
