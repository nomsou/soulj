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
                className="space-y-3 opacity-70 cursor-not-allowed select-none group"
              >
                <div
                  className="aspect-[3/4] relative overflow-hidden flex flex-col items-center justify-center transition-colors duration-500 animate-pulse"
                  style={{ background: "var(--card)" }}
                >
                  <div className="absolute inset-0 bg-black/5 dark:bg-black/20 backdrop-blur-[2px] transition-all group-hover:backdrop-blur-[4px]" />

                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Lock
                      size={18}
                      strokeWidth={1.5}
                      style={{ color: "var(--body)" }}
                    />
                    <span
                      className="text-[9px] tracking-[0.3em] uppercase font-bold px-2 py-0.5"
                      style={{
                        background: "var(--border)",
                        color: "var(--body)",
                      }}
                    >
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
