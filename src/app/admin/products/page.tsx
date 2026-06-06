import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";
import { ProductActions } from "@/components/admin/ProductActions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { position: "asc" },
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-xl font-medium" style={{ color: "#0D0D0A" }}>
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="text-xs tracking-[0.15em] uppercase px-4 py-2.5 transition-all hover:opacity-80"
          style={{ background: "#0D0D0A", color: "#E8E2C8" }}
        >
          + Add
        </Link>
      </div>

      <div style={{ border: "0.5px solid #D5D2BF" }}>
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p
              className="text-xs tracking-[0.15em] uppercase"
              style={{ color: "#3D4A28" }}
            >
              No products yet
            </p>
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 md:gap-5 px-4 md:px-5 py-4"
              style={{ borderBottom: "0.5px solid #EAE7D8" }}
            >
              <div
                className="w-10 h-14 md:w-12 md:h-16 shrink-0 flex items-center justify-center"
                style={{
                  background:
                    p.color.toLowerCase() === "black" ? "#0D0D0A" : "#E2DFCF",
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
                    style={{ color: "#888" }}
                  >
                    S
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium mb-0.5 truncate"
                  style={{ color: "#0D0D0A" }}
                >
                  {p.name}
                </p>
                <p
                  className="text-xs tracking-[0.08em] uppercase"
                  style={{ color: "#3D4A28" }}
                >
                  {p.color} · {p.size} · {p.stock} left
                </p>
              </div>

              <div className="flex items-center gap-3 md:gap-5 shrink-0">
                <p
                  className="text-sm hidden sm:block"
                  style={{ color: "#0D0D0A" }}
                >
                  {formatNGN(p.priceNGN)}
                </p>
                <span
                  className="text-[10px] tracking-[0.08em] uppercase px-2 py-1"
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
