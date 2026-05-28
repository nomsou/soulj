"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { formatNGN } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  size: string;
  priceNGN: number;
  stock: number;
  images: string[];
};

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const router = useRouter();

  const isBlack = product.color.toLowerCase() === "black";
  const outOfStock = product.stock === 0;
  const images = product.images ?? [];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleAddToCart = (showToast = true) => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      color: product.color,
      size: product.size,
      priceNGN: product.priceNGN,
      image: images[0] ?? "",
      quantity: 1,
    });

    if (showToast) {
      toast.success(`${product.name} added to cart.`, {
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      });
    }
  };

  return (
    <div
      className="min-h-screen pt-20 pb-20"
      style={{ background: "var(--page)" }}
    >
      <div className="px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start py-10">
        <div className="space-y-3">
          <div
            className="relative aspect-[3/4] w-full overflow-hidden flex items-center justify-center"
            style={{
              background: isBlack ? "var(--card-dark)" : "var(--card)",
            }}
          >
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            ) : (
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: "var(--muted)" }}
              >
                Soulj
              </span>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className="w-16 aspect-square overflow-hidden border-2 transition-all"
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

        <div className="md:pt-4 space-y-8">
          <div>
            <p
              className="text-xs tracking-[0.25em] uppercase mb-3"
              style={{ color: "var(--muted)" }}
            >
              Soulj — Drop 001
            </p>

            <h1
              className="text-3xl font-medium mb-4"
              style={{ color: "var(--body)" }}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <p
                className="text-2xl font-medium"
                style={{ color: "var(--body)" }}
              >
                {formatNGN(product.priceNGN)}
              </p>
            </div>
          </div>

          <div
            className="space-y-3 border-t border-b py-6"
            style={{ borderColor: "var(--border)" }}
          >
            {[
              ["Colour", product.color],
              ["Size", product.size],
              ["Delivery", "Flat ₦2,500 — Nigeria only"],
              ["Stock", outOfStock ? "Sold out" : `${product.stock} left`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span
                  className="tracking-[0.1em] uppercase text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  {label}
                </span>
                <span style={{ color: "var(--body)" }}>{val}</span>
              </div>
            ))}
          </div>

          {product.description && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {product.description}
            </p>
          )}

          <div className="space-y-3">
            <button
              onClick={() => handleAddToCart(true)}
              disabled={outOfStock}
              className="w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--body)", color: "var(--page)" }}
            >
              {outOfStock ? "Sold out" : "Add to cart"}
            </button>

            <button
              onClick={() => {
                handleAddToCart(false);
                router.push("/cart");
              }}
              disabled={outOfStock}
              className="w-full py-4 text-sm tracking-[0.2em] uppercase border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--body)] hover:text-[var(--page)]"
              style={{
                borderColor: "var(--body)",
                color: "var(--body)",
                background: "transparent",
              }}
            >
              Buy now
            </button>
          </div>

          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Questions?{" "}
            <a
              href="mailto:hello@soulj.com"
              className="underline underline-offset-2"
            >
              hello@soulj.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
