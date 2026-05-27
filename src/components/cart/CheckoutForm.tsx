"use client";

import { useState } from "react";
import { useCart, CartItem } from "@/store/cart";
import { formatNGN, formatUSD } from "@/lib/utils";
import { PaystackButton } from "./PaystackButton";
import { ArrowLeft } from "lucide-react";

type Props = {
  items: CartItem[];
  currency: "NGN" | "USD";
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  onBack: () => void;
};

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
};

export function CheckoutForm({
  items,
  currency,
  subtotal,
  deliveryFee,
  grandTotal,
  onBack,
}: Props) {
  const fmt = (n: number) => (currency === "NGN" ? formatNGN(n) : formatUSD(n));

  const [info, setInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const validate = () => {
    const e: Partial<CustomerInfo> = {};
    if (!info.firstName.trim()) e.firstName = "Required";
    if (!info.lastName.trim()) e.lastName = "Required";
    if (!info.email.trim() || !info.email.includes("@"))
      e.email = "Valid email required";
    if (!info.phone.trim()) e.phone = "Required";
    if (!info.address.trim()) e.address = "Required";
    if (!info.city.trim()) e.city = "Required";
    if (!info.state.trim()) e.state = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const field = (
    key: keyof CustomerInfo,
    label: string,
    type = "text",
    placeholder = "",
  ) => (
    <div className="space-y-1">
      <label
        className="text-xs tracking-[0.12em] uppercase"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={info[key]}
        placeholder={placeholder}
        onChange={(e) => setInfo((p) => ({ ...p, [key]: e.target.value }))}
        className="w-full px-4 py-3 text-sm outline-none border transition-all"
        style={{
          background: "transparent",
          borderColor: errors[key] ? "#E24B4A" : "var(--card)",
          color: "var(--body)",
        }}
      />
      {errors[key] && (
        <p className="text-xs" style={{ color: "#E24B4A" }}>
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen pt-28 pb-20 px-6 md:px-16"
      style={{ background: "var(--page)" }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase mb-10 transition-opacity hover:opacity-60"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to cart
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-16">
        {/* form */}
        <div className="space-y-8">
          <div>
            <p
              className="text-xs tracking-[0.25em] uppercase mb-6"
              style={{ color: "var(--muted)" }}
            >
              Contact
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("firstName", "First name")}
              {field("lastName", "Last name")}
              {field("email", "Email", "email", "you@example.com")}
              {field("phone", "Phone", "tel", "+234")}
            </div>
          </div>

          <div>
            <p
              className="text-xs tracking-[0.25em] uppercase mb-6"
              style={{ color: "var(--muted)" }}
            >
              Delivery address
            </p>
            <div className="space-y-4">
              {field("address", "Street address")}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field("city", "City")}
                {field("state", "State")}
              </div>
            </div>
          </div>
        </div>

        {/* summary + pay */}
        <div>
          <div
            className="border p-6 space-y-4"
            style={{ borderColor: "var(--card)" }}
          >
            <p
              className="text-xs tracking-[0.2em] uppercase font-medium"
              style={{ color: "var(--body)" }}
            >
              Order summary
            </p>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span style={{ color: "var(--muted)" }}>
                    {item.name} × {item.quantity}
                  </span>
                  <span style={{ color: "var(--body)" }}>
                    {fmt(
                      (currency === "NGN" ? item.priceNGN : item.priceUSD) *
                        item.quantity,
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="space-y-2 pt-4 border-t"
              style={{ borderColor: "var(--card)" }}
            >
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <span style={{ color: "var(--body)" }}>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Delivery</span>
                <span style={{ color: "var(--body)" }}>
                  {currency === "NGN"
                    ? formatNGN(deliveryFee)
                    : formatUSD(deliveryFee / 1500)}
                </span>
              </div>
              <div
                className="flex justify-between text-sm font-medium pt-3 border-t"
                style={{ borderColor: "var(--card)" }}
              >
                <span style={{ color: "var(--body)" }}>Total</span>
                <span style={{ color: "var(--body)" }}>{fmt(grandTotal)}</span>
              </div>
            </div>

            <PaystackButton
              customerInfo={info}
              items={items}
              currency={currency}
              grandTotal={grandTotal}
              deliveryFee={deliveryFee}
              onValidate={validate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
