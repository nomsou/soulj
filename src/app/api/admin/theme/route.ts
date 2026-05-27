import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { theme } = await req.json();
  await prisma.setting.upsert({
    where: { key: "theme" },
    update: { value: theme },
    create: { key: "theme", value: theme },
  });
  return NextResponse.json({ ok: true });
}
