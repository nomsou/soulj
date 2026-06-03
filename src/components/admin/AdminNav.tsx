"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import GlobalBrandLoader from "../layout/BrandLoader";
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Mail,
  Palette,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Shirt },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/emails", label: "Emails", icon: Mail },
  { href: "/admin/theme", label: "Theme", icon: Palette },
  { href: "/", label: "Store", icon: Store },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <p
        className="text-[9px] tracking-[0.16em] uppercase px-3 pt-2 pb-2"
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
        Manage
      </p>
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/"
            ? pathname === "/"
            : href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2.5 text-sm transition-all rounded-sm"
            style={{
              color:
                href === "/"
                  ? "rgba(232,226,200,0.7)"
                  : active
                    ? "#E8E2C8"
                    : "rgba(255,255,255,0.4)",

              background:
                href === "/"
                  ? "transparent"
                  : active
                    ? "rgba(255,255,255,0.07)"
                    : "transparent",
            }}
          >
            <Icon size={15} strokeWidth={1.5} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoggingOut(true);

    await fetch("/api/admin/logout", { method: "POST" });

    router.refresh();

    router.push("/admin/login");
  };

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999]">
          <GlobalBrandLoader />
        </div>
      )}

      <aside
        className="hidden md:flex w-56 flex-col h-screen shrink-0 sticky top-0"
        style={{ background: "#0A0A0A" }}
      >
        <div
          className="px-5 py-5 border-b shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ color: "#E8E2C8" }}
          >
            Soulj Admin
          </p>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </nav>

        <div
          className="px-2 py-4 border-t shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Link
            href="/admin/login"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-sm transition-all rounded-sm hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <LogOut size={15} strokeWidth={1.5} />
            Log out
          </Link>
        </div>
      </aside>

      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: "#0A0A0A" }}
      >
        <p
          className="text-xs tracking-[0.22em] uppercase font-medium"
          style={{ color: "#E8E2C8" }}
        >
          Soulj Admin
        </p>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{ color: "#E8E2C8" }}
        >
          {mobileOpen ? (
            <X size={18} strokeWidth={1.5} />
          ) : (
            <Menu size={18} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 flex flex-col pt-14"
          style={{ background: "#0A0A0A" }}
        >
          <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
            <NavLinks
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </nav>
          <div
            className="px-2 py-4 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <Link
              href="/admin/login"
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full text-sm transition-all rounded-sm hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              <LogOut size={15} strokeWidth={1.5} />
              Log out
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
