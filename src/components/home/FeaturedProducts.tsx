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
    <section className="px-6 md:px-16 py-24">
      <div className="flex items-end justify-between mb-12">
        <h2 className="text-2xl font-medium">Drop 001</h2>
        <Link
          href="/shop"
          className="text-xs tracking-[0.15em] uppercase text-soulj-gray hover:text-soulj-black transition-colors"
        >
          View all
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] bg-soulj-light animate-pulse" />
              <div className="h-4 w-2/3 bg-soulj-light animate-pulse rounded" />
              <div className="h-4 w-1/3 bg-soulj-light animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/shop/${p.slug}`}
              className="group space-y-3"
            >
              <div className="aspect-[3/4] bg-soulj-light overflow-hidden">
                {p.images[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-soulj-gray text-xs tracking-widest uppercase">
                    Soulj
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-sm text-soulj-gray">
                  {formatNGN(p.priceNGN)}
                </p>
              </div>
              <p className="text-xs text-soulj-gray uppercase tracking-widest">
                {p.color} — Size {p.size}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
