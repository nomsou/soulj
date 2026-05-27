"use client";

import Link from "next/link";
import { formatNGN, formatUSD } from "@/lib/utils";
import { useCart } from "@/store/cart";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    color: string;
    size: string;
    priceNGN: number;
    priceUSD: number;
    images: string[];
  };
};

export function ProductCard({ product }: Props) {
  const currency = useCart((s) => s.currency);

  const price =
    currency === "NGN"
      ? formatNGN(product.priceNGN)
      : formatUSD(product.priceUSD);

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div
        className="aspect-[3/4] overflow-hidden mb-4"
        style={{
          background:
            product.color.toLowerCase() === "black"
              ? "var(--card-dark)"
              : "var(--card)",
        }}
      >
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: "var(--muted)" }}
            >
              Soulj
            </span>
          </div>
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
        </div>
        <p className="text-sm shrink-0" style={{ color: "var(--muted)" }}>
          {price}
        </p>
      </div>
    </Link>
  );
}
