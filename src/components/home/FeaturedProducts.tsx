import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";
import { Lock } from "lucide-react";

export async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    take: 3,
    orderBy: { position: "asc" },
  });

  return (
    <section className="px-6 md:px-16 py-20">
      <div className="flex items-end justify-between mb-12">
        <h2 className="text-2xl font-medium" style={{ color: "var(--body)" }}>
          Drop 001
        </h2>
        <Link
          href="/shop"
          className="text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-60"
          style={{ color: "var(--muted)" }}
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => {
          const isLocked = !p.published;

          if (isLocked) {
            return (
              <div
                key={p.id}
                className="space-y-3 opacity-80 cursor-not-allowed select-none group"
              >
                <div
                  className="aspect-[3/4] relative overflow-hidden flex flex-col items-center justify-center transition-all duration-500"
                  style={{
                    background:
                      p.color.toLowerCase() === "black"
                        ? "var(--card-dark)"
                        : "var(--card)",
                  }}
                >
                  {p.images && p.images[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-50 group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 animate-pulse bg-black/10 dark:bg-white/5" />
                  )}

                  <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[1px] transition-all group-hover:backdrop-blur-[2px]" />

                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Lock size={18} strokeWidth={1.5} className="text-white" />
                    <span className="text-[9px] tracking-[0.3em] uppercase font-bold px-2 py-0.5 bg-white text-black">
                      Coming Soon
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--body)" }}
                  >
                    {p.name}
                  </p>
                  <p
                    className="text-sm line-through opacity-40"
                    style={{ color: "var(--muted)" }}
                  >
                    {formatNGN(p.priceNGN)}
                  </p>
                </div>
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "var(--muted)" }}
                >
                  {p.color} — Drop 002
                </p>
              </div>
            );
          }

          return (
            <Link
              key={p.id}
              href={`/shop/${p.slug}`}
              className="group space-y-3"
            >
              <div
                className="aspect-[3/4] overflow-hidden flex items-center justify-center"
                style={{
                  background:
                    p.color.toLowerCase() === "black"
                      ? "var(--card-dark)"
                      : "var(--card)",
                }}
              >
                {p.images[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <span
                    className="text-xs tracking-[0.3em] uppercase"
                    style={{ color: "var(--muted)" }}
                  >
                    Soulj
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--body)" }}
                >
                  {p.name}
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {formatNGN(p.priceNGN)}
                </p>
              </div>
              <p
                className="text-xs uppercase tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                {p.color} — Size {p.size}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
