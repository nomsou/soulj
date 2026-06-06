import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const getShippingFee = (stateName: string): number => {
  const normalizedState = stateName.toLowerCase().trim();

  if (normalizedState === "federal capital territory") {
    return 2500;
  }
  if (normalizedState === "lagos") {
    return 4500;
  }
  if (normalizedState === "enugu") {
    return 4500;
  }

  return 2500;
};

export async function POST(req: NextRequest) {
  try {
    const { customerInfo, items } = await req.json();

    const parsedItems = items.map((item: any) => {
      const parts = item.id.split("-");
      const baseProductId = parts[0];
      return {
        ...item,
        databaseProductId: baseProductId,
        extractedSize: parts[1] || "L",
      };
    });

    const productIds = parsedItems.map((item: any) => item.databaseProductId);

    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let calculatedSubtotalNGN = 0;
    const securedItems = [];

    for (const clientItem of parsedItems) {
      const dbProduct = dbProducts.find(
        (p) => p.id === clientItem.databaseProductId,
      );
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product not found: ${clientItem.name}` },
          { status: 404 },
        );
      }

      calculatedSubtotalNGN += dbProduct.priceNGN * clientItem.quantity;

      securedItems.push({
        id: clientItem.id,
        databaseProductId: clientItem.databaseProductId,
        name: dbProduct.name,
        color: dbProduct.color,
        priceNGN: dbProduct.priceNGN,
        quantity: clientItem.quantity,
        size: clientItem.extractedSize,
        isPreorder: clientItem.isPreorder || false,
      });
    }

    const deliveryFeeNGN = getShippingFee(customerInfo.state);
    const baseTargetTotalNGN = calculatedSubtotalNGN + deliveryFeeNGN;

    let finalPaystackTotalNGN = baseTargetTotalNGN;
    if (baseTargetTotalNGN > 0) {
      const calculatedWithFee = (baseTargetTotalNGN + 100) / (1 - 0.015);
      const prospectiveFee = calculatedWithFee - baseTargetTotalNGN;

      if (prospectiveFee > 2000) {
        finalPaystackTotalNGN = baseTargetTotalNGN + 2000;
      } else {
        finalPaystackTotalNGN = calculatedWithFee;
      }
    }

    const amountInKobo = Math.round(finalPaystackTotalNGN * 100);

    const cryptoSlice = crypto.randomBytes(3).toString("hex").toUpperCase();
    const reference = `SOULJ-${cryptoSlice}`;

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

    if (!res.ok || !data.status) {
      console.error("[PAYSTACK GATEWAY REFUSAL]:", data);
      return NextResponse.json(
        { error: data.message || "Paystack initialization rejected" },
        { status: 400 },
      );
    }

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
        items: securedItems,
        subtotalNGN: calculatedSubtotalNGN,
        deliveryFee: deliveryFeeNGN,
        totalNGN: finalPaystackTotalNGN,
        currency: "NGN",
        status: "PENDING",
        paystackRef: reference,
      },
    });

    return NextResponse.json({
      reference,
      accessCode: data.data.access_code,
    });
  } catch (error) {
    console.error("[CHECKOUT SYSTEM FAILURE]:", error);
    return NextResponse.json(
      { error: "Internal processing exception" },
      { status: 500 },
    );
  }
}
