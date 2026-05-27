import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { subject, body, recipients } = await req.json();

  await Promise.all(
    recipients.map((to: string) =>
      resend.emails.send({
        from: "Soulj <hello@yourdomain.com>",
        to,
        subject,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#0D0D0A;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#3D4A28;margin-bottom:24px;">
              Soulj — Abuja
            </p>
            <div style="font-size:14px;line-height:1.7;white-space:pre-wrap;">${body}</div>
            <hr style="margin:32px 0;border:none;border-top:1px solid #E2DFCF;" />
            <p style="font-size:11px;color:#3D4A28;">
              You're receiving this because you subscribed at soulj.com
            </p>
          </div>
        `,
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
