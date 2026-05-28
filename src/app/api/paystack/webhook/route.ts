import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const reference = event.data.reference;

    // 1. Mark order as paid
    const order = await prisma.order.update({
      where: { reference },
      data: { status: "PAID" },
    });

    // 2. AUTO-SUBSCRIBE: Upsert the customer's email into the Subscriber table
    await prisma.subscriber.upsert({
      where: { email: order.email },
      update: {}, // If they already exist, do absolutely nothing
      create: { email: order.email }, // If they are new, create the row
    });

    const items = order.items as any[];

    const itemsTableRows = items
      .map(
        (item: any) => `
        <tr>
          <td style="font-size:13px;padding:8px 0;border-bottom:1px solid #E2DFCF;color:#0D0D0A;">
            ${item.name} — ${item.color} × ${item.quantity}
          </td>
          <td style="font-size:13px;padding:8px 0;border-bottom:1px solid #E2DFCF;text-align:right;color:#0D0D0A;">
            ₦${(item.priceNGN * item.quantity).toLocaleString()}
          </td>
        </tr>`,
      )
      .join("");

    // ---- Email to customer ----
    await sendEmail({
      to: order.email,
      subject: "Your Soulj order is confirmed.",
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#0D0D0A;">
          <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#3D4A28;margin-bottom:24px;">
            Soulj — Abuja
          </p>
          <h2 style="font-size:22px;font-weight:500;margin-bottom:8px;">
            Thank you, ${order.firstName}.
          </h2>
          <p style="font-size:14px;color:#3D4A28;margin-bottom:32px;">
            Your order has been confirmed. We'll reach out when it ships.
          </p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            ${itemsTableRows}
            <tr>
              <td style="font-size:13px;padding:8px 0;color:#3D4A28;">Delivery</td>
              <td style="font-size:13px;padding:8px 0;text-align:right;color:#3D4A28;">₦2,500</td>
            </tr>
            <tr>
              <td style="font-size:14px;font-weight:500;padding:10px 0;">Total</td>
              <td style="font-size:14px;font-weight:500;padding:10px 0;text-align:right;">
                ₦${order.totalNGN.toLocaleString()}
              </td>
            </tr>
          </table>
          <div style="background:#F5F5F0;padding:16px;margin-bottom:32px;">
            <p style="font-size:11px;color:#3D4A28;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.1em;">
              Delivery address
            </p>
            <p style="font-size:13px;color:#0D0D0A;margin:0;">
              ${order.address}, ${order.city}, ${order.state}
            </p>
          </div>
          <p style="font-size:11px;color:#3D4A28;">Ref: ${order.reference}</p>
          <hr style="margin:32px 0;border:none;border-top:1px solid #E2DFCF;" />
          <p style="font-size:11px;color:#3D4A28;">
            Questions? Reply to this email or reach us at hello@soulj.com
          </p>
        </div>
      `,
    });

    // ---- Email to admin ----
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: `New order — ${order.reference}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#0D0D0A;">
          <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#3D4A28;margin-bottom:20px;">
            Soulj — New Order
          </p>
          <h2 style="font-size:20px;font-weight:500;margin-bottom:16px;">
            ${order.firstName} ${order.lastName} just placed an order.
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            ${itemsTableRows}
            <tr>
              <td style="font-size:13px;padding:8px 0;color:#3D4A28;">Delivery</td>
              <td style="font-size:13px;padding:8px 0;text-align:right;color:#3D4A28;">₦2,500</td>
            </tr>
            <tr>
              <td style="font-size:14px;font-weight:500;padding:10px 0;">Total</td>
              <td style="font-size:14px;font-weight:500;padding:10px 0;text-align:right;">
                ₦${order.totalNGN.toLocaleString()}
              </td>
            </tr>
          </table>
          <div style="background:#F2EFE4;padding:14px;margin-bottom:12px;">
            <p style="font-size:11px;color:#3D4A28;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em;">Customer</p>
            <p style="font-size:13px;margin:0 0 2px;">${order.firstName} ${order.lastName}</p>
            <p style="font-size:13px;margin:0 0 2px;">${order.email}</p>
            <p style="font-size:13px;margin:0;">${order.phone}</p>
          </div>
          <div style="background:#F2EFE4;padding:14px;margin-bottom:20px;">
            <p style="font-size:11px;color:#3D4A28;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em;">Delivery address</p>
            <p style="font-size:13px;margin:0;">${order.address}, ${order.city}, ${order.state}</p>
          </div>
          <p style="font-size:11px;color:#3D4A28;">Ref: ${order.reference}</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #E2DFCF;" />
          <p style="font-size:11px;color:#3D4A28;">
            Log in to manage this order: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders
          </p>
        </div>
      `,
    });
  }

  // ---- Dispatch notification ----
  // if (event.event === "order.dispatched") {
  //   const reference = event.data.reference;
  //   const order = await prisma.order.findUnique({ where: { reference } });
  //   if (order) {
  //     await sendEmail({
  //       to: order.email,
  //       subject: "Your Soulj order is on its way.",
  //       html: `
  //         <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#0D0D0A;">
  //           <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#3D4A28;margin-bottom:24px;">
  //             Soulj — Abuja
  //           </p>
  //           <h2 style="font-size:22px;font-weight:500;margin-bottom:8px;">
  //             Your order is on its way, ${order.firstName}.
  //           </h2>
  //           <p style="font-size:14px;color:#3D4A28;margin-bottom:24px;">
  //             Your Soulj order has been dispatched and is headed to you.
  //           </p>
  //           <div style="background:#F5F5F0;padding:16px;margin-bottom:24px;">
  //             <p style="font-size:11px;color:#3D4A28;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.1em;">
  //               Delivering to
  //             </p>
  //             <p style="font-size:13px;color:#0D0D0A;margin:0;">
  //               ${order.address}, ${order.city}, ${order.state}
  //             </p>
  //           </div>
  //           <p style="font-size:13px;color:#3D4A28;margin-bottom:24px;">
  //             If you have any questions, reply to this email or reach us at hello@soulj.com
  //           </p>
  //           <p style="font-size:11px;color:#3D4A28;">Ref: ${order.reference}</p>
  //           <hr style="margin:32px 0;border:none;border-top:1px solid #E2DFCF;" />
  //           <p style="font-size:11px;color:#3D4A28;">Soulj. Abuja, Nigeria.</p>
  //         </div>
  //       `,
  //     });
  //   }
  // }
  return NextResponse.json({ received: true });
}
