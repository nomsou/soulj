import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://soulj.com",
  ),
  title: {
    default: "Soulj — Abuja Streetwear",
    template: "%s — Soulj",
  },
  description:
    "Soulj is an Abuja-born streetwear brand. Drop 001 — plain tees and longsleeves, made for the culture.",
  keywords: ["Soulj", "Abuja streetwear", "Nigerian fashion", "Drop 001"],
  openGraph: {
    title: "Soulj — Abuja Streetwear",
    description: "Abuja-born streetwear. Drop 001 now live.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://soulj.com",
    siteName: "Soulj",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soulj — Abuja Streetwear",
    description: "Abuja-born streetwear. Drop 001 now live.",
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
  const theme = setting?.value ?? "olive";

  return (
    <html lang="en" data-theme={theme}>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "font-sans antialiased min-h-screen flex flex-col",
        )}
        style={{ background: "var(--page)", color: "var(--body)" }}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
