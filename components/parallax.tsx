"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function Parallax({
  children,
  className,
  strength = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = layer.getBoundingClientRect();
      const distanceFromCenter = window.innerHeight / 2 - (rect.top + rect.height / 2);
      const offset = Math.max(-42, Math.min(42, distanceFromCenter * strength));
      layer.style.setProperty("--parallax-y", `${offset}px`);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={layerRef} className={cn("parallax-layer", className)}>
      {children}
    </div>
  );
}
