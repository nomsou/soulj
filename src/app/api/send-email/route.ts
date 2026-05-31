import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { subject, body, recipients } = await req.json();

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients selected" },
        { status: 400 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Soulj <hello@soulj.xyz>",
      to: "hello@soulj.xyz",
      bcc: recipients,
      replyTo: "support@soulj.xyz",
      subject: subject,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#0D0D0A;">
          <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#3D4A28;margin-bottom:24px;">
            Soulj — Abuja
          </p>
          <div style="font-size:14px;line-height:1.7;white-space:pre-wrap;">${body}</div>
          <hr style="margin:32px 0;border:none;border-top:1px solid #E2DFCF;" />
          <p style="font-size:11px;color:#3D4A28;">
            You're receiving this because you subscribed at soulj.xyz
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend delivery block error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Critical campaign API failure:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
