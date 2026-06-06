import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data,
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${product.slug}`);
  revalidatePath("/admin/products");

  return NextResponse.json(product);
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
