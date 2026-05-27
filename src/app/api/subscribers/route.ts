import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  try {
    const subscriber = await prisma.subscriber.create({
      data: { email },
    });
    return NextResponse.json(subscriber);
  } catch {
    return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
  }
}

export async function GET() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(subscribers);
}
