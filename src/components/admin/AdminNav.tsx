"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Mail,
  Palette,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Shirt },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/emails", label: "Emails", icon: Mail },
  { href: "/admin/theme", label: "Theme", icon: Palette },
];

export function AdminNav() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <aside
      className="w-56 flex flex-col min-h-screen shrink-0"
      style={{ background: "#0A0A0A" }}
    >
      <div
        className="px-5 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <p
          className="text-xs tracking-[0.22em] uppercase font-medium"
          style={{ color: "#E8E2C8" }}
        >
          Soulj Admin
        </p>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5">
        <p
          className="text-[9px] tracking-[0.16em] uppercase px-3 pt-2 pb-2"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Manage
        </p>
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm transition-all rounded-sm"
              style={{
                color: active ? "#E8E2C8" : "rgba(255,255,255,0.4)",
                background: active ? "rgba(255,255,255,0.07)" : "transparent",
              }}
            >
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div
        className="px-2 py-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-sm transition-all rounded-sm hover:bg-white/5"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <LogOut size={15} strokeWidth={1.5} />
          Log out
        </button>
      </div>
    </aside>
  );
}
