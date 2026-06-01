import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";
import { Lock } from "lucide-react";

export async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
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
                className="space-y-3 opacity-70 cursor-not-allowed select-none group"
              >
                {/* RESTORED: Added animate-pulse right here to pull back that breathing rhythm */}
                <div
                  className="aspect-[3/4] relative overflow-hidden flex flex-col items-center justify-center transition-colors duration-500 animate-pulse"
                  style={{ background: "var(--card)" }}
                >
                  <div className="absolute inset-0 bg-black/5 dark:bg-black/20 backdrop-blur-[2px] transition-all group-hover:backdrop-blur-[4px]" />

                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Lock
                      size={18}
                      strokeWidth={1.5}
                      style={{ color: "var(--body)" }}
                    />
                    <span
                      className="text-[9px] tracking-[0.3em] uppercase font-bold px-2 py-0.5"
                      style={{
                        background: "var(--border)",
                        color: "var(--body)",
                      }}
                    >
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
