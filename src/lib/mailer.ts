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
  const recipients = Array.isArray(to) ? to : [to];

  const results = await Promise.allSettled(
    recipients.map((recipient) =>
      resend.emails.send({
        from: "Soulj Orders <orders@soulj.xyz>",
        to: recipient,
        subject,
        html,
        replyTo: "support@soulj.xyz",
      }),
    ),
  );

  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(`Failed to send email to ${recipients[i]}:`, result.reason);
    } else if (result.value.error) {
      console.error(`Resend error for ${recipients[i]}:`, result.value.error);
    } else {
      console.log(
        `Email sent successfully to ${recipients[i]}, id: ${result.value.data?.id}`,
      );
    }
  });

  return results;
}
