import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/ProductDetail";
import GlobalBrandLoader from "@/components/layout/BrandLoader";
import type { Metadata } from "next";

type Props = { params: { slug: string } };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) return {};

  return {
    title: `${product.name} — ${product.color}`,
    description:
      product.description ?? `${product.name} by Soulj. Abuja streetwear.`,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

async function ProductDataFetcher({ slug }: { slug: string }) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();
  return <ProductDetail product={product} />;
}

export default async function ProductPage({ params }: { params: any }) {
  const { slug } = await params;

  return (
    <div className="min-h-screen" style={{ background: "var(--page)" }}>
      <Suspense
        fallback={
          <div className="relative h-screen">
            <GlobalBrandLoader />
          </div>
        }
      >
        <ProductDataFetcher slug={slug} />
      </Suspense>
    </div>
  );
}
