import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const toArray = Array.isArray(to) ? to : [to];

  return Promise.all(
    toArray.map((recipient) =>
      resend.emails.send({
        from: `Soulj <${process.env.EMAIL_FROM}>`,
        to: recipient,
        subject,
        html,
      }),
    ),
  );
}
