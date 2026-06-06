import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // 1. Separate legacy keys from your standard valid schema fields
    const { size, stock, ...allowedData } = body;

    // 2. Prepare or merge inventory map states
    let finalSizesStock = allowedData.sizesStock;

    // If the legacy layout properties are detected, map them safely into the JSON matrix
    if (!finalSizesStock && (size || stock !== undefined)) {
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });
      const currentStockMap = (existingProduct?.sizesStock || {
        M: 0,
        L: 0,
        XL: 0,
        "2XL": 0,
      }) as Record<string, number>;

      if (size) {
        currentStockMap[size] =
          stock !== undefined ? Number(stock) : currentStockMap[size] || 0;
      }
      finalSizesStock = currentStockMap;
    }

    // 3. Process the schema update cleanly
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: allowedData.name,
        slug: allowedData.slug,
        description: allowedData.description,
        priceNGN:
          allowedData.priceNGN !== undefined
            ? Number(allowedData.priceNGN)
            : undefined,
        color: allowedData.color,
        images: allowedData.images,
        published: allowedData.published,
        position:
          allowedData.position !== undefined
            ? Number(allowedData.position)
            : undefined,
        ...(finalSizesStock && { sizesStock: finalSizesStock }),
      },
    });

    // 4. Force state syncing via path revalidation
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/shop/${product.slug}`);
    revalidatePath("/admin/products");

    return NextResponse.json(product);
  } catch (err) {
    console.error("[SOULJ ADMIN API PUT EXCEPTION]:", err);
    return NextResponse.json(
      { error: "Failed to update product details" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.product.delete({
    where: { id },
  });

  if (product) {
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/shop/${product.slug}`);
    revalidatePath("/admin/products");
  }

  return NextResponse.json({ ok: true });
}
