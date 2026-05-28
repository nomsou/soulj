"use client";

import { useState } from "react";
import { useCart, CartItem } from "@/store/cart";
import { useRouter } from "next/navigation";
import { CustomerInfo } from "./CheckoutForm";

type Props = {
  customerInfo: CustomerInfo;
  items: CartItem[];
  grandTotal: number;
  deliveryFeeNGN: number;
  onValidate: () => boolean;
};

export function PaystackButton({
  customerInfo,
  items,
  grandTotal,
  deliveryFeeNGN,
  onValidate,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    if (!onValidate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo,
          items,
          grandTotal,
          deliveryFeeNGN,
        }),
      });

      const { reference, accessCode } = await res.json();

      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();

      paystack.resumeTransaction(accessCode, {
        onSuccess: async () => {
          // Navigating forward immediately; cart cleanup shifts securely to the next screen
          router.push(`/order/${reference}`);
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85"
      style={{ background: "var(--body)", color: "var(--page)" }}
    >
      {loading ? "Processing..." : "Pay now"}
    </button>
  );
}
