import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const data = await req.json();
  const product = await prisma.product.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(product);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
