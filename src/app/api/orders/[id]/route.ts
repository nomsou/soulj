import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { status } = await req.json();

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  if (status === "DELIVERED") {
    const items = order.items as any[];

    await sendEmail({
      to: order.email,
      subject: "Your Soulj order has been delivered.",
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#0D0D0A;">
          <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#3D4A28;margin-bottom:24px;">
            Soulj — Abuja
          </p>
          <h2 style="font-size:22px;font-weight:500;margin-bottom:8px;">
            Your order has been delivered, ${order.firstName}.
          </h2>
          <p style="font-size:14px;color:#3D4A28;margin-bottom:32px;">
            We hope you love it. Wear your soul.
          </p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            ${items
              .map(
                (item: any) => `
              <tr>
                <td style="font-size:13px;padding:8px 0;border-bottom:1px solid #E2DFCF;color:#0D0D0A;">
                  ${item.name} — ${item.color} × ${item.quantity}
                </td>
              </tr>`,
              )
              .join("")}
          </table>
          <p style="font-size:13px;color:#3D4A28;margin-bottom:24px;">
            If anything is wrong with your order, reach us at
            <a href="mailto:hello@soulj.com" style="color:#0D0D0A;">hello@soulj.com</a>
          </p>
          <p style="font-size:11px;color:#3D4A28;">Ref: ${order.reference}</p>
          <hr style="margin:32px 0;border:none;border-top:1px solid #E2DFCF;" />
          <p style="font-size:11px;color:#3D4A28;">Soulj. Abuja, Nigeria.</p>
        </div>
      `,
    });
  }

  revalidatePath("/admin/orders");

  return NextResponse.json(order);
}
