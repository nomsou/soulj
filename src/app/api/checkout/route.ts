import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { customerInfo, items, currency, grandTotal, deliveryFee } =
    await req.json();

  const amountInKobo =
    currency === "NGN"
      ? Math.round(grandTotal * 100)
      : Math.round(grandTotal * 100);

  const reference = `SOULJ-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase()}`;

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: customerInfo.email,
      amount: amountInKobo,
      currency: currency,
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
      subtotalNGN: grandTotal - deliveryFee,
      deliveryFee,
      totalNGN: grandTotal,
      currency,
      status: "PENDING",
      paystackRef: reference,
    },
  });

  return NextResponse.json({
    reference,
    accessCode: data.data.access_code,
  });
}
