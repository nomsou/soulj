"use client";

import Link from "next/link";
import { formatNGN } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    color: string;
    size: string;
    priceNGN: number;
    images: string[];
    stock: number;
  };
};

export function ProductCard({ product }: Props) {
  const isBlack = product.color.toLowerCase() === "black";

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div
        className="aspect-[3/4] overflow-hidden mb-4 flex items-center justify-center"
        style={{ background: isBlack ? "var(--card-dark)" : "var(--card)" }}
      >
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--muted)" }}
          >
            Soulj
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "var(--body)" }}
          >
            {product.name}
          </p>
          <p
            className="text-xs tracking-[0.15em] uppercase"
            style={{ color: "var(--muted)" }}
          >
            {product.color} — Size {product.size}
          </p>
          {product.stock === 0 && (
            <p
              className="text-xs tracking-[0.1em] uppercase mt-1"
              style={{ color: "var(--muted)", opacity: 0.5 }}
            >
              Sold out
            </p>
          )}
        </div>
        <p className="text-sm shrink-0" style={{ color: "var(--muted)" }}>
          {formatNGN(product.priceNGN)}
        </p>
      </div>
    </Link>
  );
}
