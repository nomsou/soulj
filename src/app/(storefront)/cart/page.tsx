import { CartPage } from "@/components/cart/CartPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cart" };

export default function Cart() {
  return <CartPage />;
}
