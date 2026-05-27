"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";

export function Navbar() {
  const items = useCart((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mix-blend-difference">
      <Link
        href="/"
        className="text-sm font-medium tracking-[0.2em] uppercase text-white"
      >
        Soulj
      </Link>

      <nav className="hidden md:flex items-center gap-10">
        {["Shop", "About", "Contact"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="text-xs tracking-[0.15em] uppercase text-white hover:opacity-60 transition-opacity"
          >
            {item}
          </Link>
        ))}
      </nav>

      <Link href="/cart" className="relative text-white">
        <ShoppingBag size={18} strokeWidth={1.5} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-soulj-black text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>
    </header>
  );
}
