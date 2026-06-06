"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const CAROUSEL_SLIDES = [
  {
    type: "video",
    src: "https://res.cloudinary.com/df5chn3ki/video/upload/w_1920,c_limit,q_92,f_auto,vc_auto/hero_oula98.mp4",
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_1.jpg",
    duration: 5000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_2.jpg",
    duration: 5000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_3.jpg",
    duration: 5000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_4.jpg",
    duration: 5000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_5.jpg",
    duration: 5000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_6.jpg",
    duration: 5000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_7.jpg",
    duration: 5000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_8.jpg",
    duration: 5000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_9.jpg",
    duration: 5000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_10.jpg",
    duration: 5000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_11.jpg",
    duration: 5000,
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/df5chn3ki/image/upload/w_1920,c_limit,q_90,f_auto/look_12.jpg",
    duration: 5000,
  },
];

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const [muted, setMuted] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const activeSlide = CAROUSEL_SLIDES[currentSlide];

  let activeDotIndex = 0;
  if (currentSlide === 0) activeDotIndex = 0;
  else if (currentSlide <= 6) activeDotIndex = 1;
  else activeDotIndex = 2;

  useEffect(() => {
    const t = setTimeout(() => {
      setShowPrompt(true);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // Slide Progress Engine
  useEffect(() => {
    setProgress(0);
    let intervalId: NodeJS.Timeout;
    let startTime = Date.now();

    if (activeSlide.type === "video") {
      const video = videoRef.current;
      if (!video) return;

      const handleTimeUpdate = () => {
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    } else {
      const duration = activeSlide.duration || 5000;

      intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(currentProgress);

        if (elapsed >= duration) {
          clearInterval(intervalId);
          handleNextSlide();
        }
      }, 30);
    }

    return () => clearInterval(intervalId);
  }, [currentSlide]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const handleVideoEnded = () => {
    handleNextSlide();
  };

  // Manual dot clicking targets the start of each group chunk
  const handleDotClick = (dotIndex: number) => {
    if (dotIndex === 0) setCurrentSlide(0); // Video
    if (dotIndex === 1) setCurrentSlide(1); // First Image Slide
    if (dotIndex === 2) setCurrentSlide(7); // Seventh Image Slide
  };

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
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {activeSlide.type === "video" ? (
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover"
          key={activeSlide.src}
        >
          <source src={activeSlide.src} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 w-full h-full grid grid-cols-1 md:grid-cols-2 bg-black">
          <div className="relative w-full h-full">
            <Image
              src={activeSlide.src}
              alt="Soulj Primary Visual"
              fill
              priority
              className="object-cover w-full h-full"
            />
          </div>
          <div className="hidden md:block relative w-full h-full border-l border-white/5">
            <Image
              src={
                CAROUSEL_SLIDES[(currentSlide + 1) % CAROUSEL_SLIDES.length]
                  ?.type === "image"
                  ? CAROUSEL_SLIDES[(currentSlide + 1) % CAROUSEL_SLIDES.length]
                      .src
                  : CAROUSEL_SLIDES[1].src
              }
              alt="Soulj Secondary Spread"
              fill
              priority
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}

      {activeSlide.type === "video" &&
        (!audioEnabled ? (
          showPrompt && (
            <button
              onClick={enableAudio}
              className="absolute top-16 right-6 z-20 px-4 py-2 text-xs tracking-[0.2em] uppercase text-white bg-black/70 backdrop-blur-md border border-white/20 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
            >
              Tap to enable sound
            </button>
          )
        ) : (
          <button
            onClick={toggleMute}
            className="absolute top-16 right-6 z-20 p-2 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        ))}

      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        {[0, 1, 2].map((dotIndex) => {
          const isDotActive = dotIndex === activeDotIndex;
          const radius = 10;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset =
            circumference - (progress / 100) * circumference;

          return (
            <button
              key={dotIndex}
              onClick={() => handleDotClick(dotIndex)}
              className="relative w-6 h-6 flex items-center justify-center group"
              aria-label={`Go to section ${dotIndex + 1}`}
            >
              {isDotActive && (
                <svg className="absolute w-6 h-6 -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    className="stroke-white/40 fill-none"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    className="stroke-white fill-none transition-all ease-linear"
                    strokeWidth="1.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
              )}
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isDotActive
                    ? "bg-white scale-110"
                    : "bg-white/40 group-hover:bg-white/70"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-16 pb-16 md:pb-24 pointer-events-none">
        <div className="pointer-events-auto">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 text-white/60">
            Abuja — Drop 001
          </p>
          <h1 className="text-5xl md:text-7xl font-medium leading-none mb-8 text-white">
            Wear Your
            <br />
            Soul
          </h1>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase px-6 py-3 w-fit border border-white text-white transition-all duration-300 hover:opacity-80"
          >
            Shop the drop
          </Link>
        </div>
      </div>
    </section>
  );
}
