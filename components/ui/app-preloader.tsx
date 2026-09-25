"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function PencilLoader({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="160px"
      width="160px"
      viewBox="0 0 200 200"
      className={cn("pencil text-primary shrink-0", className)}
      role="img"
      aria-label="Loading animation"
    >
      <defs>
        <clipPath id="pencil-eraser">
          <rect height="30" width="30" ry="5" rx="5" />
        </clipPath>
      </defs>
      <circle
        transform="rotate(-113,100,100)"
        strokeLinecap="round"
        strokeDashoffset="439.82"
        strokeDasharray="439.82 439.82"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        r="70"
        className="pencil__stroke"
      />
      <g transform="translate(100,100)" className="pencil__rotate">
        <g fill="none">
          <circle
            transform="rotate(-90)"
            strokeDashoffset="402"
            strokeDasharray="402.12 402.12"
            strokeWidth="30"
            stroke="var(--pencil-body1, hsl(168,68%,38%))"
            r="64"
            className="pencil__body1"
          />
          <circle
            transform="rotate(-90)"
            strokeDashoffset="465"
            strokeDasharray="464.96 464.96"
            strokeWidth="10"
            stroke="var(--pencil-body2, hsl(168,68%,50%))"
            r="74"
            className="pencil__body2"
          />
          <circle
            transform="rotate(-90)"
            strokeDashoffset="339"
            strokeDasharray="339.29 339.29"
            strokeWidth="10"
            stroke="var(--pencil-body3, hsl(168,75%,26%))"
            r="54"
            className="pencil__body3"
          />
        </g>
        <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
          <g className="pencil__eraser-skew">
            <rect
              height="30"
              width="30"
              ry="5"
              rx="5"
              fill="var(--pencil-eraser, hsl(168,55%,70%))"
            />
            <rect
              clipPath="url(#pencil-eraser)"
              height="30"
              width="5"
              fill="var(--pencil-eraser-shadow, hsl(168,55%,58%))"
            />
            <rect
              height="20"
              width="30"
              fill="var(--pencil-ferrule-1, hsl(168,12%,88%))"
            />
            <rect
              height="20"
              width="15"
              fill="var(--pencil-ferrule-2, hsl(168,12%,70%))"
            />
            <rect
              height="20"
              width="5"
              fill="var(--pencil-ferrule-3, hsl(168,12%,80%))"
            />
            <rect
              height="2"
              width="30"
              y="6"
              fill="hsla(168,20%,10%,0.2)"
            />
            <rect
              height="2"
              width="30"
              y="13"
              fill="hsla(168,20%,10%,0.2)"
            />
          </g>
        </g>
        <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
          <polygon
            points="15 0,30 30,0 30"
            fill="var(--pencil-wood-1, hsl(35,80%,72%))"
          />
          <polygon
            points="15 0,6 30,0 30"
            fill="var(--pencil-wood-2, hsl(35,75%,52%))"
          />
          <polygon
            points="15 0,20 10,10 10"
            fill="var(--pencil-lead, hsl(168,20%,15%))"
          />
        </g>
      </g>
    </svg>
  );
}

export function AppPreloader() {
  const [mounted, setMounted] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Start fading out after animation plays
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1000);

    // Completely unmount after transition completes
    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 1450);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading..."
      className={cn(
        "fixed inset-0 z-[99999] flex items-center justify-center bg-background/95 backdrop-blur-md select-none transition-all duration-400 ease-out",
        isFading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      )}
    >
      <PencilLoader />
    </div>
  );
}
