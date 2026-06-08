import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    where: { status: { in: ["PAID", "DELIVERED"] } },
    orderBy: { createdAt: "desc" },
  });

  const rows: string[] = [];

  rows.push(
    [
      "Reference",
      "Date",
      "Time",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Address",
      "City",
      "State",
      "Items",
      "Subtotal (NGN)",
      "Delivery Fee (NGN)",
      "Total (NGN)",
      "Status",
    ]
      .map((h) => `"${h}"`)
      .join(","),
  );

  for (const order of orders) {
    const items = (Array.isArray(order.items) ? order.items : []) as any[];

    const itemsSummary = items
      .map(
        (item: any) =>
          `${item.name} (${item.color}, ${item.size}) x${item.quantity}${item.isPreorder ? " [PREORDER]" : ""}`,
      )
      .join(" | ");

    const date = new Date(order.createdAt);
    const dateStr = date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const row = [
      order.reference,
      dateStr,
      timeStr,
      order.firstName,
      order.lastName,
      order.email,
      order.phone,
      order.address,
      order.city,
      order.state,
      itemsSummary,
      order.subtotalNGN.toFixed(2),
      order.deliveryFee.toFixed(2),
      order.totalNGN.toFixed(2),
      order.status,
    ]
      .map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`)
      .join(",");

    rows.push(row);
  }

  const csv = rows.join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="soulj-orders-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
