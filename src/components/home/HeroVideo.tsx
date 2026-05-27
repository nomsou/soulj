"use client";

import Link from "next/link";

export function HeroVideo() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-16 pb-20">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "var(--hero-text)" }}
        >
          Abuja — Drop 001
        </p>
        <h1
          className="text-5xl md:text-7xl font-medium leading-none mb-8"
          style={{ color: "var(--hero-text)" }}
        >
          Wear Your
          <br />
          Soul
        </h1>
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-white border border-white/40 px-6 py-3 w-fit hover:bg-white hover:text-soulj-black transition-all duration-300"
        >
          Shop the drop
        </Link>
      </div>
    </section>
  );
}
