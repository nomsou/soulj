import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Isolate legacy metrics from the core setup object block
    const { size, stock, ...allowedData } = body;

    // 2. Initialize a secure multi-size JSON object grid state
    let finalSizesStock = allowedData.sizesStock;

    if (!finalSizesStock) {
      // Build a fresh template base
      const defaultMap: Record<string, number> = {
        M: 0,
        L: 0,
        XL: 0,
        "2XL": 0,
      };
      if (size) {
        defaultMap[size] = stock !== undefined ? Number(stock) : 0;
      } else if (stock !== undefined) {
        // Fallback fallback edge case: assigns stock metric straight into L by default parameter
        defaultMap["L"] = Number(stock);
      }
      finalSizesStock = defaultMap;
    }

    // 3. Persist transaction data record
    const product = await prisma.product.create({
      data: {
        name: allowedData.name,
        slug: allowedData.slug,
        description: allowedData.description,
        priceNGN: Number(allowedData.priceNGN || 0),
        color: allowedData.color || "Default",
        images: allowedData.images || [],
        published: allowedData.published || false,
        position:
          allowedData.position !== undefined ? Number(allowedData.position) : 0,
        sizesStock: finalSizesStock,
      },
    });

    // 4. Update the path layouts
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");

    return NextResponse.json(product);
  } catch (err) {
    console.error("[SOULJ ADMIN API POST EXCEPTION]:", err);
    return NextResponse.json(
      { error: "Failed to instantiate product entry" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}
