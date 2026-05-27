import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";
import { prisma } from "@/lib/prisma";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Soulj",
  description: "Abuja-born streetwear.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setting = await prisma.setting.findUnique({ where: { key: "theme" } });
  const theme = setting?.value ?? "olive";
  return (
    <html
      lang="en"
      data-theme={theme}
      className={cn("font-sans", geist.variable)}
    >
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "bg-soulj-white text-soulj-black font-sans antialiased",
        )}
      >
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
