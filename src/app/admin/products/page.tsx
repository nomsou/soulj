import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";
import { ProductActions } from "@/components/admin/ProductActions";
import Link from "next/link";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium" style={{ color: "var(--body)" }}>
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="text-xs tracking-[0.15em] uppercase px-5 py-2.5 transition-all"
          style={{ background: "var(--body)", color: "var(--page)" }}
        >
          Add product
        </Link>
      </div>

      <div className="border divide-y" style={{ borderColor: "var(--card)" }}>
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p
              className="text-xs tracking-[0.15em] uppercase"
              style={{ color: "var(--muted)" }}
            >
              No products yet
            </p>
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-5 px-5 py-4"
              style={{ borderColor: "var(--card)" }}
            >
              <div
                className="w-12 h-16 shrink-0 flex items-center justify-center"
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
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="text-[8px] tracking-widest uppercase"
                    style={{ color: "var(--muted)" }}
                  >
                    S
                  </span>
                )}
              </div>

              <div className="flex-1">
                <p
                  className="text-sm font-medium mb-0.5"
                  style={{ color: "var(--body)" }}
                >
                  {p.name}
                </p>
                <p
                  className="text-xs tracking-[0.1em] uppercase"
                  style={{ color: "var(--muted)" }}
                >
                  {p.color} — {p.size} — Stock: {p.stock}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <p className="text-sm" style={{ color: "var(--body)" }}>
                  {formatNGN(p.priceNGN)}
                </p>
                <span
                  className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1"
                  style={{
                    color: p.published ? "#1D9E75" : "#BA7517",
                    background: p.published ? "#1D9E7518" : "#BA751718",
                  }}
                >
                  {p.published ? "Live" : "Draft"}
                </span>
                <ProductActions productId={p.id} slug={p.slug} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
