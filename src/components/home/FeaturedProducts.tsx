import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";

export async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { published: true },
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

      {products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div
                className="aspect-[3/4] animate-pulse"
                style={{ background: "var(--card)" }}
              />
              <div
                className="h-4 w-2/3 animate-pulse"
                style={{ background: "var(--card)" }}
              />
              <div
                className="h-4 w-1/3 animate-pulse"
                style={{ background: "var(--card)" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
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
          ))}
        </div>
      )}
    </section>
  );
}
