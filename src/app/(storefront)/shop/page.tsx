import type { Metadata } from "next";
import { Suspense } from "react"; //
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/shop/ProductGrid";
import GlobalBrandLoader from "@/components/layout/BrandLoader";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop Soulj Drop 001 — heavyweight branded tees. Abuja streetwear.",
};

async function ProductsDataFetcher() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ProductGrid products={products} />;
}

export default function ShopPage() {
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
            Made For The Culture
          </p>
          <h1 className="text-3xl font-medium" style={{ color: "var(--body)" }}>
            Drop 001
          </h1>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="relative h-[50vh]">
            <GlobalBrandLoader />
          </div>
        }
      >
        <ProductsDataFetcher />
      </Suspense>
    </div>
  );
}
