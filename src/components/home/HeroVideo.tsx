"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [muted, setMuted] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowPrompt(true);
    }, 1500);

    return () => clearTimeout(t);
  }, []);

  const enableAudio = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;

    try {
      await video.play();
    } catch {}

    setMuted(false);
    setAudioEnabled(true);
    setShowPrompt(false);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/df5chn3ki/video/upload/w_1920,c_limit,q_92,f_auto,vc_auto/hero_oula98.mp4"
          type="video/mp4"
        />
      </video>

      {!audioEnabled ? (
        showPrompt && (
          <button
            onClick={enableAudio}
            className="
              absolute top-16 right-6 z-20
              px-4 py-2 text-xs tracking-[0.2em] uppercase
              text-white
              bg-black/70
              backdrop-blur-md
              border border-white/20
              rounded-full
              shadow-[0_8px_30px_rgba(0,0,0,0.35)]
              sound-pulse
            "
          >
            Tap to enable sound
          </button>
        )
      ) : (
        <button
          onClick={toggleMute}
          className="absolute top-16 right-6 z-20 p-2 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition"
          aria-label="Toggle sound"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-16 pb-16 md:pb-24">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "var(--hero-text)", opacity: 0.6 }}
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
          className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase px-6 py-3 w-fit border transition-all duration-300 hover:opacity-80"
          style={{
            color: "var(--hero-text)",
            borderColor: "var(--hero-text)",
          }}
        >
          Shop the drop
        </Link>
      </div>
    </section>
  );
}
