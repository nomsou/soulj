import type { Metadata } from "next";
import { HeroVideo } from "@/components/home/HeroVideo";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { SubscribeBanner } from "@/components/home/SubscribeBanner";

export const metadata: Metadata = {
  title: "Soulj — Abuja Streetwear",
  description:
    "Soulj is an Abuja-born streetwear brand. Drop 001 — heavyweight tees.",
};

export default function HomePage() {
  return (
    <>
      <HeroVideo />
      <FeaturedProducts />
      <SubscribeBanner />
    </>
  );
}
