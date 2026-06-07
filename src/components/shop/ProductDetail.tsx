"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { formatNGN } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SizeOption = "M" | "L" | "XL" | "2XL";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  priceNGN: number;
  images: string[];
  sizesStock: any;
};

export function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<SizeOption>("L");
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const router = useRouter();

  const isBlack = product.color.toLowerCase() === "black";
  const images = product.images ?? [];

  const stockMap = (product.sizesStock || {}) as Record<SizeOption, number>;
  const currentStock = stockMap[selectedSize] || 0;

  const isPreorderActive = currentStock <= 0;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleAddToCart = (showToast = true) => {
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      color: product.color,
      size: selectedSize,
      priceNGN: product.priceNGN,
      image: images[0] ?? "",
      isPreorder: isPreorderActive,
      quantity: 1,
    });

    if (showToast) {
      toast.success(`${product.name} (${selectedSize}) added to cart.`, {
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
          <div className="space-y-3">
            <div
              className="relative aspect-[3/4] w-full overflow-hidden flex items-center justify-center"
              style={{
                background: isBlack ? "var(--card-dark)" : "var(--card)",
              }}
            >
              <div
                className="absolute top-0 left-0 w-full p-3.5 backdrop-blur-md border-b z-10"
                style={{
                  background: "rgba(0, 0, 0, 0.7)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <p className="text-[11px] tracking-wide m-0 text-center text-white font-medium">
                  ⚡️ Fit profile: Models are wearing size Large.
                </p>
              </div>

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
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 z-10"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 z-10"
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
            <p
              className="text-2xl font-medium"
              style={{ color: "var(--body)" }}
            >
              {formatNGN(product.priceNGN)}
            </p>
          </div>

          <div className="space-y-3">
            <label
              className="tracking-[0.1em] uppercase text-xs block font-medium"
              style={{ color: "var(--muted)" }}
            >
              Select Size
            </label>
            <div className="flex gap-3">
              {(["M", "L", "XL", "2XL"] as const).map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className="w-14 h-12 text-xs font-bold border transition-all duration-300"
                    style={{
                      borderColor: isSelected ? "var(--body)" : "var(--border)",
                      background: isSelected ? "var(--body)" : "transparent",
                      color: isSelected ? "var(--page)" : "var(--body)",
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="space-y-3 border-t border-b py-6"
            style={{ borderColor: "var(--border)" }}
          >
            {[
              ["Colour", product.color],
              ["Delivery", "Abuja ₦2,500 — Others vary by courier"],
              [
                "Availability",
                isPreorderActive
                  ? "Preorder Only (Ships in 1-2 weeks)"
                  : `In Stock (${currentStock} ${currentStock === 1 ? "piece" : "pieces"} left)`,
              ],
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

          <div
            className="p-3.5 text-xs font-mono border space-y-2 transition-all duration-300"
            style={{
              borderColor: "var(--border)",
              background: isPreorderActive
                ? "transparent"
                : "rgba(var(--body-rgb, 0,0,0), 0.02)",
            }}
          >
            {isPreorderActive ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <p className="font-bold uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400">
                    Preorder active
                  </p>
                </div>
                <p
                  style={{ color: "var(--muted)" }}
                  className="leading-relaxed font-sans italic text-[11px]"
                >
                  This specific size is cut-to-order. Production and dispatch
                  takes 1–2 weeks to finish.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-500" />
                  <p
                    className="font-bold uppercase tracking-[0.1em]"
                    style={{ color: "var(--body)" }}
                  >
                    Ready to ship
                  </p>
                </div>
                <p
                  style={{ color: "var(--muted)" }}
                  className="leading-relaxed font-sans text-[11px]"
                >
                  Last {currentStock} {currentStock === 1 ? "piece" : "pieces"}{" "}
                  left on our racks. Standard Abuja delivery within 1 week.
                </p>
              </>
            )}
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
              type="button"
              onClick={() => handleAddToCart(true)}
              className="w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-200"
              style={{ background: "var(--body)", color: "var(--page)" }}
            >
              {isPreorderActive ? "Preorder Now" : "Add to cart"}
            </button>

            <button
              type="button"
              onClick={() => {
                handleAddToCart(false);
                router.push("/cart");
              }}
              className="w-full py-4 text-sm tracking-[0.2em] uppercase border transition-all duration-200 hover:bg-[var(--body)] hover:text-[var(--page)]"
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
