"use client";

import React from "react";
import { Parallax } from "@/components/parallax";

export function FloatingLeaf({
  className = "",
  color = "#65a30d",
  size = 22,
  animClass = "leaf-anim-1",
}: {
  className?: string;
  color?: string;
  size?: number;
  animClass?: string;
}) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <div className={animClass}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 4C14 4 8 8 6 13.5C4.5 17.5 5.5 20 5.5 20C5.5 20 8.2 21 12.5 19.5C18 17.5 21.5 11.5 21.5 6L20 4Z"
            fill={color}
            opacity="0.9"
          />
          <path
            d="M5.5 20C8.5 17 14 11.5 20 4"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>
      </div>
    </div>
  );
}

export function FloatingSprout({
  className = "",
  color = "#65a30d",
  size = 20,
  animClass = "leaf-anim-2",
}: {
  className?: string;
  color?: string;
  size?: number;
  animClass?: string;
}) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <div className={animClass}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 14C9.5 14 6 11 6 7C9.5 7 12 9.5 12 14Z"
            fill={color}
            opacity="0.9"
          />
          <path
            d="M12 12C14.5 12 18 9 18 5C14.5 5 12 7.5 12 12Z"
            fill="#0f766e"
            opacity="0.85"
          />
          <path
            d="M12 21C12 16 12 12 12 7"
            stroke="#134e48"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </div>
    </div>
  );
}

export function FloatingBreeze({
  className = "",
  color = "#0f766e",
  width = 46,
  height = 14,
  animClass = "float-gentle",
}: {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  animClass?: string;
}) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <div className={animClass}>
        <svg width={width} height={height} viewBox="0 0 46 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 9C10 9 16 3 26 3C34 3 40 6 44 10"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2.5 3.5"
            opacity="0.35"
          />
          <circle cx="43" cy="3" r="1.5" fill={color} opacity="0.4" />
          <circle cx="36" cy="11" r="1.2" fill={color} opacity="0.3" />
        </svg>
      </div>
    </div>
  );
}

export function FloatingSparkle({
  className = "",
  color = "#f59e0b",
  size = 18,
  animClass = "sparkle-pulse",
}: {
  className?: string;
  color?: string;
  size?: number;
  animClass?: string;
}) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <div className={animClass}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
            fill={color}
            opacity="0.85"
          />
        </svg>
      </div>
    </div>
  );
}

export function FloatingSeed({
  className = "",
  color = "#d97706",
  size = 22,
  animClass = "seed-spin",
}: {
  className?: string;
  color?: string;
  size?: number;
  animClass?: string;
}) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <div className={animClass}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="6" cy="18" rx="3.5" ry="2.5" fill={color} opacity="0.9" />
          <path
            d="M7 16.5C10 13 18 5 21 3C19 8 13 15 8.5 17.5"
            fill={color}
            opacity="0.55"
          />
        </svg>
      </div>
    </div>
  );
}

export function FloatingDewDrop({
  className = "",
  color = "#06b6d4",
  size = 15,
  animClass = "leaf-anim-3",
}: {
  className?: string;
  color?: string;
  size?: number;
  animClass?: string;
}) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <div className={animClass}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3C12 3 5 12 5 16C5 19.866 8.134 23 12 23C15.866 23 19 19.866 19 16C19 12 12 3 12 3Z"
            fill={color}
            opacity="0.75"
          />
          <circle cx="9.5" cy="14.5" r="1.6" fill="#ffffff" opacity="0.65" />
        </svg>
      </div>
    </div>
  );
}

import { InteractiveFloatingCanvas } from "@/components/interactive-floating-canvas";
export { InteractiveFloatingCanvas };

export function DashboardFloatingBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden select-none z-0">
      {/* Subtle Ambient Radiant Glow Halos */}
      <div className="absolute -top-24 -left-24 size-[32rem] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-1/3 -right-24 size-[28rem] rounded-full bg-secondary/5 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 size-[36rem] rounded-full bg-primary/5 blur-3xl" />

      {/* Hardware-Accelerated Interactive Canvas (Click Shockwaves & Bursts, Scroll Wind) */}
      <InteractiveFloatingCanvas count={16} interactive={true} />
    </div>
  );
}
