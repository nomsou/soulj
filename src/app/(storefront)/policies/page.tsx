import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "Soulj shipping, returns, and refund policies. Abuja streetwear Drop 001.",
};

const sections = [
  {
    title: "Shipping",
    content: [
      "We currently ship within Nigeria only.",
      "All orders are shipped via a trusted courier service from Abuja.",
      "Flat delivery fee of ₦2,500 applies exclusively to orders within Abuja FCT.",
      "For deliveries to other states, shipping fees are calculated at checkout depending on the courier service rate.",
      "Orders are processed within 1–2 business days after payment is confirmed.",
      "Delivery typically takes 5 business days within Abuja, and 10 business days for other states depending on your location.",
      "You will receive a notification with tracking details once your order has been dispatched.",
    ],
  },
  {
    title: "Returns & Exchanges",
    content: [
      "We accept returns within 2 days of delivery.",
      "Items must be unworn, unwashed, and in their original condition with all tags intact.",
      "To initiate a return or exchange, contact us at support@soulj.xyz with your order reference and reason.",
      "Customers are responsible for the cost of return shipping unless the item received was defective or incorrect.",
      "Once we receive and inspect the returned item, we will process your exchange or issue store credit within 3–5 business days.",
      "We do not offer cash refunds — all approved returns are issued as store credit valid for 6 months.",
      "Sale items and limited edition drops are final sale and cannot be returned or exchanged.",
    ],
  },
  {
    title: "Refunds",
    content: [
      "Refunds are only issued in cases where an item is confirmed defective or significantly different from what was described.",
      "If you received a damaged or incorrect item, please contact us within 48 hours of delivery with photos of the item.",
      "Approved refunds will be processed back to your original payment method within 5–10 business days.",
      "We reserve the right to deny refund requests that do not meet the above conditions.",
    ],
  },
  {
    title: "Sizing",
    content: [
      "Drop 001 is available in Size L only.",
      "Our heavyweight tees are cut for a relaxed, slightly oversized fit.",
      "If you are between sizes or unsure, we recommend sizing up.",
      "Contact us at support@soulj.xyz if you need specific measurements before ordering.",
    ],
  },
  {
    title: "Order Cancellations",
    content: [
      "Orders can only be cancelled within 2 hours of placement, before processing begins.",
      "To cancel an order, contact us immediately at support@soulj.xyz with your order reference.",
      "Once an order has been processed or dispatched, it cannot be cancelled.",
    ],
  },
  {
    title: "Privacy",
    content: [
      "We collect your name, email, phone number, and delivery address solely to process and fulfil your order.",
      "We do not sell or share your personal information with third parties.",
      "Your email may be used to send order updates and, if you subscribed, occasional brand updates. You can unsubscribe at any time.",
      "Payments are processed securely by Paystack. We do not store your card details.",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <div
      className="min-h-screen pt-28 pb-20 px-6 md:px-16"
      style={{ background: "var(--page)" }}
    >
      <div className="max-w-2xl">
        <p
          className="text-xs tracking-[0.28em] uppercase mb-3"
          style={{ color: "var(--muted)" }}
        >
          Soulj
        </p>
        <h1
          className="text-3xl font-medium mb-16"
          style={{ color: "var(--body)" }}
        >
          Policies
        </h1>

        <div className="space-y-14">
          {sections.map((s) => (
            <div key={s.title}>
              <h2
                className="text-xs tracking-[0.2em] uppercase font-medium mb-5 pb-3 border-b"
                style={{
                  color: "var(--body)",
                  borderColor: "var(--border)",
                }}
              >
                {s.title}
              </h2>
              <ul className="space-y-3">
                {s.content.map((line, i) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed flex gap-3"
                    style={{ color: "var(--muted)" }}
                  >
                    <span
                      className="shrink-0 mt-1.5 w-1 h-1 rounded-full"
                      style={{ background: "var(--muted)" }}
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-16 pt-8 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Questions? Reach us at{" "}
            <a
              href="mailto:support@soulj.xyz"
              className="underline underline-offset-2"
            >
              support@soulj.xyz
            </a>{" "}
            or{" "}
            <a
              href="tel:+ +2348078397832"
              className="underline underline-offset-2"
            >
              +234 807 839 7832
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
