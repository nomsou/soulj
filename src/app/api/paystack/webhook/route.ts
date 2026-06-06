import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error(
        "[SOULJ WEBHOOK] Warning: Invalid signature verification block.",
      );
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const ultimateAmountPaid = event.data.amount / 100;

      const order = await prisma.order.update({
        where: { reference },
        data: {
          status: "PAID",
          totalNGN: ultimateAmountPaid,
        },
      });

      await prisma.subscriber.upsert({
        where: { email: order.email.toLowerCase().trim() },
        update: {},
        create: { email: order.email.toLowerCase().trim() },
      });

      const items = (Array.isArray(order.items) ? order.items : []) as any[];
      const baseTargetTotal = order.subtotalNGN + order.deliveryFee;
      const processingFeeNGN = Math.max(0, order.totalNGN - baseTargetTotal);

      const itemsTableRows = items
        .map((item: any) => {
          const badge = item.isPreorder
            ? ` <span style="font-size:9px; background:#3D4A28; color:#ffffff; padding:2px 5px; font-weight:bold; margin-left:4px; letter-spacing:0.05em;">PREORDER</span>`
            : "";

          return `
            <tr>
              <td style="font-size:13px;padding:8px 0;border-bottom:1px solid #E2DFCF;color:#0D0D0A;">
                ${item.name || "Item"} — ${item.color || "Default"} (${item.size || "L"})${badge} × ${item.quantity || 1}
              </td>
              <td style="font-size:13px;padding:8px 0;border-bottom:1px solid #E2DFCF;text-align:right;color:#0D0D0A;">
                ₦${((item.priceNGN || 0) * (item.quantity || 1)).toLocaleString()}
              </td>
            </tr>`;
        })
        .join("");

      try {
        await sendEmail({
          to: order.email.toLowerCase().trim(),
          subject: "Your Soulj order is confirmed.",
          html: `
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#0D0D0A;">
              <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#3D4A28;margin-bottom:24px;">Soulj — Drop 001</p>
              <h2 style="font-size:22px;font-weight:500;margin-bottom:8px;">Thank you, ${order.firstName}.</h2>
              <p style="font-size:14px;color:#3D4A28;margin-bottom:32px;">
                Your order has been confirmed. We'll reach out when it ships. If your order contains a preorder piece, your package will ship consolidated once everything finishes production.
              </p>
              <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                ${itemsTableRows}
                <tr>
                  <td style="font-size:13px;padding:8px 0;color:#3D4A28;">Subtotal</td>
                  <td style="font-size:13px;padding:8px 0;text-align:right;color:#0D0D0A;">₦${order.subtotalNGN.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;padding:8px 0;color:#3D4A28;">Delivery (${order.state})</td>
                  <td style="font-size:13px;padding:8px 0;text-align:right;color:#0D0D0A;">₦${order.deliveryFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;padding:8px 0;color:#3D4A28;">Processing Fee</td>
                  <td style="font-size:13px;padding:8px 0;text-align:right;color:#0D0D0A;">₦${processingFeeNGN.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="font-size:14px;font-weight:500;padding:10px 0;border-top:1px solid #0D0D0A;">Total</td>
                  <td style="font-size:14px;font-weight:500;padding:10px 0;text-align:right;border-top:1px solid #0D0D0A;color:#0D0D0A;">₦${order.totalNGN.toLocaleString()}</td>
                </tr>
              </table>
              <div style="background:#F5F5F0;padding:16px;margin-bottom:32px;">
                <p style="font-size:11px;color:#3D4A28;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.1em;">Delivery address</p>
                <p style="font-size:13px;color:#0D0D0A;margin:0;line-height:1.5;">${order.address},<br />${order.city}, ${order.state}</p>
              </div>
              <p style="font-size:11px;color:#3D4A28;">Ref: ${order.reference}</p><hr style="margin:32px 0;border:none;border-top:1px solid #E2DFCF;" />
              <p style="font-size:11px;color:#3D4A28;">
                Questions? Reply to this email or reach us at support@soulj.xyz
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error("[SOULJ] Customer receipt delivery exception:", err);
      }

      try {
        await sendEmail({
          to: (process.env.ADMIN_EMAIL || "support@soulj.xyz")
            .toLowerCase()
            .trim(),
          subject: `New order — ${order.reference}`,
          html: `
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#0D0D0A;">
              <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#3D4A28;margin-bottom:20px;">Soulj — New Order</p>
              <h2 style="font-size:20px;font-weight:500;margin-bottom:16px;">${order.firstName} ${order.lastName} just placed an order.</h2>
              <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                ${itemsTableRows}
                <tr>
                  <td style="font-size:13px;padding:8px 0;color:#3D4A28;">Subtotal</td>
                  <td style="font-size:13px;padding:8px 0;text-align:right;color:#0D0D0A;">₦${order.subtotalNGN.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;padding:8px 0;color:#3D4A28;">Delivery</td>
                  <td style="font-size:13px;padding:8px 0;text-align:right;color:#0D0D0A;">₦${order.deliveryFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;padding:8px 0;color:#3D4A28;">Processing Fee</td>
                  <td style="font-size:13px;padding:8px 0;text-align:right;color:#0D0D0A;">₦${processingFeeNGN.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="font-size:14px;font-weight:500;padding:10px 0;border-top:1px solid #0D0D0A;">Total</td>
                  <td style="font-size:14px;font-weight:500;padding:10px 0;text-align:right;border-top:1px solid #0D0A0A;">₦${order.totalNGN.toLocaleString()}</td>
                </tr>
              </table>
              <div style="background:#F2EFE4;padding:14px;margin-bottom:12px;">
                <p style="font-size:11px;color:#3D4A28;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em;">Customer</p>
                <p style="font-size:13px;margin:0 0 2px;">${order.firstName} ${order.lastName}</p>
                <p style="font-size:13px;margin:0;">${order.email} | ${order.phone}</p>
              </div>
              <div style="background:#F2EFE4;padding:14px;margin-bottom:20px;">
                <p style="font-size:11px;color:#3D4A28;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em;">Delivery address</p>
                <p style="font-size:13px;margin:0;">${order.address}, ${order.city}, ${order.state}</p>
              </div>
            </div>
          `,
        });
      } catch (err) {
        console.error(
          "[SOULJ] Admin confirmation dispatch alert exception:",
          err,
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[SOULJ WEBHOOK CRASH]:", err);
    return NextResponse.json(
      { error: "Webhook system failure context" },
      { status: 500 },
    );
  }
}
