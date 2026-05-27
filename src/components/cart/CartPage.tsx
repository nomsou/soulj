"use client";

import { useCart } from "@/store/cart";
import { formatNGN, formatUSD } from "@/lib/utils";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { CheckoutForm } from "./CheckoutForm";
import { useState } from "react";

export function CartPage() {
  const { items, removeItem, updateQuantity, currency, total } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  const fmt = (n: number) => (currency === "NGN" ? formatNGN(n) : formatUSD(n));

  const deliveryFeeNGN = 2500;
  const deliveryFeeUSD = 2;
  const deliveryFee = currency === "NGN" ? deliveryFeeNGN : deliveryFeeUSD;
  const grandTotal = total() + deliveryFee;

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: "var(--page)" }}
      >
        <p
          className="text-xs tracking-[0.25em] uppercase"
          style={{ color: "var(--muted)" }}
        >
          Your cart is empty
        </p>
        <Link
          href="/shop"
          className="text-xs tracking-[0.2em] uppercase border px-6 py-3 transition-all hover:opacity-70"
          style={{ borderColor: "var(--body)", color: "var(--body)" }}
        >
          Back to shop
        </Link>
      </div>
    );
  }

  if (checkingOut) {
    return (
      <CheckoutForm
        items={items}
        currency={currency}
        subtotal={total()}
        deliveryFeeNGN={deliveryFeeNGN}
        deliveryFeeUSD={deliveryFeeUSD}
        grandTotal={grandTotal}
        onBack={() => setCheckingOut(false)}
      />
    );
  }

  return (
    <div
      className="min-h-screen pt-28 pb-20 px-6 md:px-16"
      style={{ background: "var(--page)" }}
    >
      <h1
        className="text-2xl font-medium mb-12"
        style={{ color: "var(--body)" }}
      >
        Cart
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-16">
        <div className="space-y-0">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="flex gap-5 py-6 border-t"
              style={{
                borderColor: "var(--border)",
                ...(i === items.length - 1 && {
                  borderBottom: `0.5px solid var(--border)`,
                }),
              }}
            >
              <div
                className="w-24 h-32 shrink-0 flex items-center justify-center"
                style={{
                  background:
                    item.color.toLowerCase() === "black"
                      ? "var(--card-dark)"
                      : "var(--card)",
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="text-[9px] tracking-[0.25em] uppercase"
                    style={{ color: "var(--muted)" }}
                  >
                    Soulj
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "var(--body)" }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs tracking-[0.12em] uppercase"
                      style={{ color: "var(--muted)" }}
                    >
                      {item.color} — Size {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ color: "var(--muted)" }}
                    aria-label="Remove item"
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-4 border px-3 py-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.id, item.quantity - 1)
                          : removeItem(item.id)
                      }
                      style={{ color: "var(--muted)" }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} strokeWidth={1.5} />
                    </button>
                    <span
                      className="text-sm w-4 text-center"
                      style={{ color: "var(--body)" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ color: "var(--muted)" }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} strokeWidth={1.5} />
                    </button>
                  </div>

                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--body)" }}
                  >
                    {fmt(
                      (currency === "NGN" ? item.priceNGN : item.priceUSD) *
                        item.quantity,
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div
            className="border p-6 space-y-4"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="text-xs tracking-[0.2em] uppercase font-medium"
              style={{ color: "var(--body)" }}
            >
              Order summary
            </p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <span style={{ color: "var(--body)" }}>{fmt(total())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Delivery</span>
                <span style={{ color: "var(--body)" }}>{fmt(deliveryFee)}</span>
              </div>
              <div
                className="flex justify-between text-sm font-medium pt-4 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <span style={{ color: "var(--body)" }}>Total</span>
                <span style={{ color: "var(--body)" }}>{fmt(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => setCheckingOut(true)}
              className="w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all hover:opacity-85"
              style={{ background: "var(--body)", color: "var(--page)" }}
            >
              Checkout
            </button>

            <Link
              href="/shop"
              className="block text-center text-xs tracking-[0.15em] uppercase pt-2 transition-all hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
