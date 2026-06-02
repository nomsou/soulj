import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://soulj.xyz",
  ),
  title: {
    default: "Soulj - Abuja Streetwear",
    template: "%s — Soulj",
  },
  description:
    "Soulj is an Abuja-born streetwear brand. Drop 001 — heavyweight branded tees, made for the culture.",
  keywords: [
    "Soulj",
    "Abuja streetwear",
    "Nigerian fashion",
    "Drop 001",
    "Branded Tees",
  ],
  openGraph: {
    title: "Soulj — Abuja Streetwear",
    description: "Abuja-born streetwear. Drop 001 branded tees now live.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://soulj.xyz",
    siteName: "Soulj",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soulj — Abuja Streetwear",
    description: "Abuja-born streetwear. Drop 001 Soulj tees now live.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setting = await prisma.setting
    .findUnique({ where: { key: "theme" } })
    .catch(() => null);
  const theme = setting?.value ?? "military";

  return (
    <html lang="en" data-theme={theme}>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "font-sans antialiased",
        )}
        style={{ background: "var(--page)", color: "var(--body)" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
