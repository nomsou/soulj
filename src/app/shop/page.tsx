import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/shop/ProductGrid";

export const metadata = {
  title: "Shop — Soulj",
  description: "Drop 001. Abuja.",
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div
      className="min-h-screen pt-24 pb-20 px-6 md:px-16"
      style={{ background: "var(--page)" }}
    >
      <div className="flex items-end justify-between mb-12 pt-8">
        <div>
          <p
            className="text-xs tracking-[0.25em] uppercase mb-2"
            style={{ color: "var(--muted)" }}
          >
            Abuja
          </p>
          <h1 className="text-3xl font-medium" style={{ color: "var(--body)" }}>
            Drop 001
          </h1>
        </div>
        <p
          className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--muted)" }}
        >
          {products.length} piece{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
