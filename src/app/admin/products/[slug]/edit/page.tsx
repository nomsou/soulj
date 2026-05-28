import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) notFound();

  return (
    <ProductForm
      initial={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description ?? "",
        priceNGN: product.priceNGN,
        color: product.color,
        size: product.size,
        stock: product.stock,
        images: product.images,
        published: product.published,
      }}
    />
  );
}
