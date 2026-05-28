"use client";

import { useState, useEffect } from "react";
import { CartItem } from "@/store/cart";
import { formatNGN } from "@/lib/utils";
import { PaystackButton } from "./PaystackButton";
import { ArrowLeft } from "lucide-react";

type Props = {
  items: CartItem[];
  subtotal: number;
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

const calculateClientShipping = (stateName: string): number => {
  const normalized = stateName.toLowerCase().trim();
  if (normalized === "federal capital territory") return 2500;
  if (normalized === "lagos") return 4500;
  if (normalized === "enugu") return 4500;
  return 2500;
};

const ALLOWED_STATES = ["Federal Capital Territory", "Lagos", "Enugu"];

const CITIES_BY_STATE: Record<string, string[]> = {
  "Federal Capital Territory": [
    "Wuse",
    "Wuse 2",
    "Gwarinpa",
    "Lifecamp",
    "Katampe",
    "Katampe Extension",
    "Maitama",
    "Asokoro",
    "Garki",
    "Central Business District",
    "Guzape",
    "Jabi",
    "Idu",
    "Utako",
    "Apo",
    "Kubwa",
    "Lugbe",
  ],
  Lagos: [
    "Lekki Phase 1",
    "Ikoyi",
    "Victoria Island (VI)",
    "Ikeja",
    "Surulere",
    "Yaba",
    "Magodo",
    "Maryland",
    "Ajah",
    "Banana Island",
    "Festac",
  ],
  Enugu: [
    "Independence Layout",
    "Achara Layout",
    "New Haven",
    "Trans Ekulu",
    "Uwani",
    "Coal Camp",
    "Thinkers Corner",
    "Gariki",
    "Ogui",
  ],
};

export function CheckoutForm({
  items,
  subtotal,
  onBack,
}: Omit<Props, "deliveryFeeNGN" | "grandTotal">) {
  const [info, setInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: ALLOWED_STATES[0],
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [currentDeliveryFee, setCurrentDeliveryFee] = useState(2500);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    setCurrentDeliveryFee(calculateClientShipping(info.state));
    setAvailableCities(CITIES_BY_STATE[info.state] || []);
  }, [info.state]);

  const activeGrandTotal = subtotal + currentDeliveryFee;

  const validate = () => {
    const e: Partial<CustomerInfo> = {};
    if (!info.firstName.trim()) e.firstName = "Required";
    if (!info.lastName.trim()) e.lastName = "Required";
    if (!info.email.trim() || !info.email.includes("@"))
      e.email = "Valid email required";
    if (!info.phone.trim()) e.phone = "Required";
    if (!info.address.trim()) e.address = "Required";
    if (!info.city) e.city = "Required";
    if (!info.state) e.state = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const textField = (
    key: keyof CustomerInfo,
    label: string,
    type = "text",
    placeholder = "",
    autoFillKey = "",
  ) => (
    <div className="space-y-1.5">
      <label
        className="text-xs tracking-[0.12em] uppercase"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </label>
      <input
        type={type}
        name={key}
        autoComplete={autoFillKey}
        value={info[key]}
        placeholder={placeholder}
        onChange={(e) => setInfo((p) => ({ ...p, [key]: e.target.value }))}
        className="w-full px-4 py-3 text-sm outline-none border transition-all"
        style={{
          background: "transparent",
          borderColor: errors[key] ? "#E24B4A" : "var(--border)",
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
        style={{ color: "var(--muted)", background: "none", border: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to cart
      </button>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-16"
      >
        <div className="space-y-8">
          <div>
            <p
              className="text-xs tracking-[0.25em] uppercase mb-6"
              style={{ color: "var(--muted)" }}
            >
              Contact
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {textField("firstName", "First name", "text", "", "given-name")}
              {textField("lastName", "Last name", "text", "", "family-name")}
              {textField("email", "Email", "email", "you@example.com", "email")}
              {textField("phone", "Phone", "tel", "+234", "tel")}
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
              {textField(
                "address",
                "Street address",
                "text",
                "",
                "street-address",
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    className="text-xs tracking-[0.12em] uppercase"
                    style={{ color: "var(--muted)" }}
                  >
                    State
                  </label>
                  <select
                    value={info.state}
                    name="state"
                    autoComplete="address-level1"
                    onChange={(e) =>
                      setInfo((p) => ({
                        ...p,
                        state: e.target.value,
                        city: "",
                      }))
                    }
                    className="w-full px-4 py-3 text-sm outline-none border bg-transparent transition-all cursor-pointer"
                    style={{
                      borderColor: errors.state ? "#E24B4A" : "var(--border)",
                      color: "var(--body)",
                    }}
                  >
                    {ALLOWED_STATES.map((state) => (
                      <option
                        key={state}
                        value={state}
                        style={{ background: "var(--page)" }}
                      >
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-xs" style={{ color: "#E24B4A" }}>
                      {errors.state}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs tracking-[0.12em] uppercase"
                    style={{ color: "var(--muted)" }}
                  >
                    Area / District
                  </label>
                  <select
                    value={info.city}
                    name="city"
                    autoComplete="address-level2"
                    onChange={(e) =>
                      setInfo((p) => ({ ...p, city: e.target.value }))
                    }
                    className="w-full px-4 py-3 text-sm outline-none border bg-transparent transition-all cursor-pointer"
                    style={{
                      borderColor: errors.city ? "#E24B4A" : "var(--border)",
                      color: "var(--body)",
                    }}
                  >
                    <option value="" style={{ background: "var(--page)" }}>
                      Select Area / District
                    </option>
                    {availableCities.map((city) => (
                      <option
                        key={city}
                        value={city}
                        style={{ background: "var(--page)" }}
                      >
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-xs" style={{ color: "#E24B4A" }}>
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
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
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex_justify-between text-sm">
                  <span style={{ color: "var(--muted)" }}>
                    {item.name} × {item.quantity}
                  </span>
                  <span style={{ color: "var(--body)" }}>
                    {formatNGN(item.priceNGN * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="space-y-2 pt-4 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <span style={{ color: "var(--body)" }}>
                  {formatNGN(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Delivery</span>
                <span style={{ color: "var(--body)" }}>
                  {formatNGN(currentDeliveryFee)}
                </span>
              </div>
              <div
                className="flex justify-between text-sm font-medium pt-3 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <span style={{ color: "var(--body)" }}>Total</span>
                <span style={{ color: "var(--body)" }}>
                  {formatNGN(activeGrandTotal)}
                </span>
              </div>
            </div>

            <PaystackButton
              customerInfo={info}
              items={items}
              grandTotal={activeGrandTotal}
              deliveryFeeNGN={currentDeliveryFee}
              onValidate={validate}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
