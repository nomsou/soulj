"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { useState } from "react";

export function Navbar() {
  const items = useCart((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{ background: "var(--nav)" }}
      >
        <Link
          href="/"
          className="text-sm font-medium tracking-[0.2em] uppercase"
          style={{ color: "var(--nav-text)" }}
        >
          Soulj
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {["Shop", "Policies"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-60"
              style={{ color: "var(--nav-text)" }}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative"
            aria-label="Cart"
            style={{ color: "var(--nav-text)" }}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {count > 0 && (
              <span
                className="absolute -top-2 -right-2 text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--nav-text)",
                  color: "var(--nav)",
                }}
              >
                {count}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            style={{ color: "var(--nav-text)" }}
          >
            {open ? (
              <X size={18} strokeWidth={1.5} />
            ) : (
              <Menu size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-20 px-6 pb-10 md:hidden"
          style={{ background: "var(--nav)" }}
        >
          <nav className="flex flex-col gap-6 mt-6">
            {["Shop", "Policies"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="text-2xl font-medium tracking-[0.1em] uppercase"
                style={{ color: "var(--nav-text)" }}
              >
                {item}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="text-2xl font-medium tracking-[0.1em] uppercase"
              style={{ color: "var(--nav-text)" }}
            >
              Cart {count > 0 && `(${count})`}
            </Link>
          </nav>

          <div className="mt-auto">
            <p
              className="text-xs tracking-[0.15em] uppercase opacity-40"
              style={{ color: "var(--nav-text)" }}
            >
              Soulj. Abuja, Nigeria.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
