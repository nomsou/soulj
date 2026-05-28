import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { customerInfo, items } = await req.json();

    const productIds = items.map((item: any) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let calculatedSubtotalNGN = 0;
    for (const clientItem of items) {
      const dbProduct = dbProducts.find((p) => p.id === clientItem.id);
      if (!dbProduct) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }
      calculatedSubtotalNGN += dbProduct.priceNGN * clientItem.quantity;
    }

    const deliveryFeeNGN = 2500;
    const finalGrandTotalNGN = calculatedSubtotalNGN + deliveryFeeNGN;

    const amountInKobo = Math.round(finalGrandTotalNGN * 100);

    const reference = `SOULJ-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerInfo.email,
        amount: amountInKobo,
        currency: "NGN",
        reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Name",
              value: `${customerInfo.firstName} ${customerInfo.lastName}`,
            },
            { display_name: "Phone", value: customerInfo.phone },
            {
              display_name: "Address",
              value: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state}`,
            },
          ],
        },
      }),
    });

    const data = await res.json();

    await prisma.order.create({
      data: {
        reference,
        email: customerInfo.email,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        items,
        subtotalNGN: calculatedSubtotalNGN,
        deliveryFee: deliveryFeeNGN,
        totalNGN: finalGrandTotalNGN,
        currency: "NGN",
        status: "PAID",
        paystackRef: reference,
      },
    });

    return NextResponse.json({
      reference,
      accessCode: data.data.access_code,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
