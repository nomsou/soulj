"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

export function ClearCartTrigger() {
  const clearCart = useCart((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
