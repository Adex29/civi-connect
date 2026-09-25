"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RoutePreloader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Reset progress and complete when pathname changes
  useEffect(() => {
    if (isLoading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, isLoading]);

  // Intercept internal link clicks to trigger instant visual feedback
  useEffect(() => {
    let t1: NodeJS.Timeout | null = null;
    let t2: NodeJS.Timeout | null = null;

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external, target=_blank, hash, or download links
      if (
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      // Ignore clicks to the exact same pathname
      const currentPath = window.location.pathname;
      if (href === currentPath) return;

      // Start preloader animation
      setIsLoading(true);
      setProgress(28);

      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);

      t1 = setTimeout(() => setProgress(68), 140);
      t2 = setTimeout(() => setProgress(88), 380);
    };

    document.addEventListener("click", handleLinkClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleLinkClick);
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, []);

  if (!isLoading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99998] pointer-events-none h-[3.5px] bg-transparent overflow-visible"
    >
      {/* Route Progress Bar */}
      <div
        className="h-full bg-gradient-to-r from-primary via-emerald-400 to-teal-300 shadow-[0_0_12px_rgba(16,185,129,0.8)] relative transition-all ease-out overflow-hidden"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "160ms" : "320ms",
          opacity: progress === 100 ? 0 : 1,
        }}
      >
        {/* Shimmer sweep effect */}
        <div className="absolute inset-0 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent" />

        {/* Glowing Leading Head Tip */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(52,211,153,1)]" />
      </div>

      {/* Subtle Top-Right Ambient Beacon */}
      <div
        className="fixed top-3 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/90 border border-primary/30 shadow-md backdrop-blur-md transition-opacity duration-200"
        style={{ opacity: progress > 0 && progress < 100 ? 1 : 0 }}
      >
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full size-2 bg-primary" />
        </span>
        <span className="text-[10px] font-mono font-bold text-foreground">Loading...</span>
      </div>
    </div>
  );
}
