"use client";

import { useState, useEffect } from "react";
import BrandLoader from "@/components/layout/BrandLoader";

export default function InitialSplashProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsFirstLoad(false);
    } else {
      const liftCurtain = () => setIsFirstLoad(false);
      window.addEventListener("load", liftCurtain);
      return () => window.removeEventListener("load", liftCurtain);
    }
  }, []);

  return (
    <>
      {isFirstLoad && (
        <div className="fixed inset-0 z-[99999] bg-[#0A0A0A] flex items-center justify-center pointer-events-none">
          <BrandLoader />
        </div>
      )}

      <div
        className={
          isFirstLoad
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-700 ease-out"
        }
      >
        {children}
      </div>
    </>
  );
}
