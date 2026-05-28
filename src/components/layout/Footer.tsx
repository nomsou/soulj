import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="mt-auto border-t"
      style={{ borderColor: "var(--border)", background: "var(--page)" }}
    >
      <div className="px-6 md:px-16 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p
            className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--body)" }}
          >
            Soulj
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Abuja-born streetwear.
            <br />
            Made for the culture.
          </p>
        </div>

        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase font-medium mb-4"
            style={{ color: "var(--body)" }}
          >
            Info
          </p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Shop", href: "/shop" },
              { label: "Policies", href: "/policies" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs tracking-[0.1em] uppercase transition-opacity hover:opacity-60"
                style={{ color: "var(--muted)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p
            className="text-xs tracking-[0.15em] uppercase font-medium mb-4"
            style={{ color: "var(--body)" }}
          >
            Contact
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:hello@soulj.com"
              className="text-xs tracking-[0.1em] transition-opacity hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              hello@soulj.com
            </a>
            <a
              href="tel:+ +2348078397832"
              className="text-xs tracking-[0.1em] transition-opacity hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              +234 807 839 7832
            </a>
          </div>
        </div>
      </div>

      <div
        className="px-6 md:px-16 py-4 border-t flex flex-col items-center gap-3"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="text-xs text-center" style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()} Soulj. All rights reserved.
        </p>

        <Link
          href="https://www.tiktok.com/@.nomso"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-[0.1em] uppercase transition-colors hover:opacity-80"
          style={{ color: "var(--body)" }}
        >
          Made by{" "}
          <span className="font-bold" style={{ color: "var(--muted)" }}>
            Nomso
          </span>
        </Link>
      </div>
    </footer>
  );
}
