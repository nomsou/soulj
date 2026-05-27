"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { formatNGN, formatUSD } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  size: string;
  priceNGN: number;
  priceUSD: number;
  stock: number;
  images: string[];
};

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, currency, setCurrency } = useCart();
  const router = useRouter();

  const price =
    currency === "NGN"
      ? formatNGN(product.priceNGN)
      : formatUSD(product.priceUSD);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      color: product.color,
      size: product.size,
      priceNGN: product.priceNGN,
      priceUSD: product.priceUSD,
      image: product.images[0] ?? "",
      quantity: 1,
    });

    toast.success(`${product.name} added to cart.`);
  };

  const outOfStock = product.stock === 0;

  return (
    <div
      className="min-h-screen pt-24 pb-20"
      style={{ background: "var(--page)" }}
    >
      <div className="px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* images */}
        <div className="space-y-3">
          <div
            className="aspect-[3/4] w-full overflow-hidden"
            style={{
              background:
                product.color.toLowerCase() === "black"
                  ? "var(--card-dark)"
                  : "var(--card)",
            }}
          >
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
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

          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className="w-16 aspect-square overflow-hidden border transition-all"
                  style={{
                    borderColor:
                      selectedImage === i ? "var(--body)" : "transparent",
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* details */}
        <div className="md:pt-8 space-y-8">
          <div>
            <p
              className="text-xs tracking-[0.25em] uppercase mb-3"
              style={{ color: "var(--muted)" }}
            >
              Soulj — Drop 001
            </p>
            <h1
              className="text-3xl font-medium mb-2"
              style={{ color: "var(--body)" }}
            >
              {product.name}
            </h1>

            {/* currency toggle + price */}
            <div className="flex items-center gap-4 mt-4">
              <p
                className="text-2xl font-medium"
                style={{ color: "var(--body)" }}
              >
                {price}
              </p>
              <div className="flex gap-2">
                {(["NGN", "USD"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className="text-[10px] tracking-[0.12em] uppercase px-2 py-1 border transition-all"
                    style={{
                      borderColor:
                        currency === c ? "var(--body)" : "var(--muted)",
                      color: currency === c ? "var(--page)" : "var(--muted)",
                      background:
                        currency === c ? "var(--body)" : "transparent",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* meta */}
          <div
            className="space-y-3 text-sm border-t border-b py-6"
            style={{
              borderColor: "var(--card)",
              color: "var(--muted)",
            }}
          >
            <div className="flex justify-between">
              <span className="tracking-[0.1em] uppercase text-xs">Colour</span>
              <span>{product.color}</span>
            </div>
            <div className="flex justify-between">
              <span className="tracking-[0.1em] uppercase text-xs">Size</span>
              <span>{product.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="tracking-[0.1em] uppercase text-xs">
                Delivery
              </span>
              <span>Flat ₦2,500</span>
            </div>
            <div className="flex justify-between">
              <span className="tracking-[0.1em] uppercase text-xs">Stock</span>
              <span>{outOfStock ? "Sold out" : `${product.stock} left`}</span>
            </div>
          </div>

          {product.description && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {product.description}
            </p>
          )}

          {/* actions */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "var(--body)",
                color: "var(--page)",
              }}
            >
              {outOfStock ? "Sold out" : "Add to cart"}
            </button>

            <button
              onClick={() => {
                handleAddToCart();
                router.push("/cart");
              }}
              disabled={outOfStock}
              className="w-full py-4 text-sm tracking-[0.2em] uppercase border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                borderColor: "var(--body)",
                color: "var(--body)",
                background: "transparent",
              }}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
