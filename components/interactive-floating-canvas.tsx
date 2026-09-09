"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  baseAngle: number;
  swaySpeed: number;
  swayPhase: number;
  scale: number;
  opacity: number;
  color: string;
  type: "leaf" | "sparkle" | "sprout" | "seed" | "dew" | "breeze";
  isBurst?: boolean;
  life?: number;
  maxLife?: number;
}

// Brand-tailored organic & civic palette (soft & calm tones)
const THEME_COLORS = [
  "#0f766e", // Pine Teal
  "#134e48", // Deep Spruce
  "#65a30d", // Leaf Green
  "#84cc16", // Fresh Lime
  "#d97706", // Soft Amber
  "#06b6d4", // Sky Dew
  "#f43f5e", // Rose Accent
];

export function InteractiveFloatingCanvas({
  className = "",
  count = 16,
  interactive = true,
}: {
  className?: string;
  count?: number;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Vector shapes
    const leafPath = new Path2D("M20 4C14 4 8 8 6 13.5C4.5 17.5 5.5 20 5.5 20C5.5 20 8.2 21 12.5 19.5C18 17.5 21.5 11.5 21.5 6L20 4Z");
    const leafStemPath = new Path2D("M5.5 20C8.5 17 14 11.5 20 4");
    const sparklePath = new Path2D("M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z");
    const sproutLeft = new Path2D("M12 14C9.5 14 6 11 6 7C9.5 7 12 9.5 12 14Z");
    const sproutRight = new Path2D("M12 12C14.5 12 18 9 18 5C14.5 5 12 7.5 12 12Z");
    const sproutStem = new Path2D("M12 21C12 16 12 12 12 7");
    const dewPath = new Path2D("M12 3C12 3 5 12 5 16C5 19.866 8.134 23 12 23C15.866 23 19 19.866 19 16C19 12 12 3 12 3Z");
    const seedWing = new Path2D("M7 16.5C10 13 18 5 21 3C19 8 13 15 8.5 17.5Z");
    const breezePath = new Path2D("M2 9C10 9 16 3 26 3C34 3 40 6 44 10");

    const particleTypes: Particle["type"][] = ["leaf", "leaf", "sparkle", "sprout", "dew", "seed", "breeze"];

    // Initialize calm, randomized particles
    const effectiveCount = prefersReducedMotion ? Math.floor(count / 2) : count;
    const particles: Particle[] = [];

    function createParticle(randomPos = true, originX?: number, originY?: number, isBurst = false): Particle {
      const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      const color = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
      const size = type === "sparkle" ? 12 + Math.random() * 6 : 16 + Math.random() * 8;

      // Gentle, calm directional drift (slow diagonal drift downwards to the right)
      const baseVx = 0.12 + Math.random() * 0.22;
      const baseVy = 0.22 + Math.random() * 0.32;

      const px = randomPos ? Math.random() * width : originX ?? Math.random() * width;
      const py = randomPos ? Math.random() * height : originY ?? Math.random() * height;

      let vx = baseVx;
      let vy = baseVy;

      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.0;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }

      return {
        x: px,
        y: py,
        vx,
        vy,
        baseVx,
        baseVy,
        size,
        baseAngle: (Math.random() - 0.5) * 0.6, // static natural tilt
        swaySpeed: 0.008 + Math.random() * 0.012, // slow, serene rocking
        swayPhase: Math.random() * Math.PI * 2,
        scale: 0.75 + Math.random() * 0.45,
        opacity: isBurst ? 0.6 : 0.22 + Math.random() * 0.25, // soft background presence
        color,
        type,
        isBurst,
        life: isBurst ? 90 : undefined,
        maxLife: isBurst ? 90 : undefined,
      };
    }

    for (let i = 0; i < effectiveCount; i++) {
      particles.push(createParticle(true));
    }

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Optional click ripple impulse & subtle burst (ZERO hover reaction)
    interface Shockwave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      strength: number;
      opacity: number;
    }
    const shockwaves: Shockwave[] = [];

    const handlePointerDown = (e: PointerEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;

      shockwaves.push({
        x: cx,
        y: cy,
        radius: 8,
        maxRadius: 140,
        strength: 3.5,
        opacity: 0.4,
      });

      // Spawn 2-3 gentle burst motes on click
      const burstCount = prefersReducedMotion ? 1 : 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < burstCount; i++) {
        if (particles.length < count + 10) {
          particles.push(createParticle(false, cx, cy, true));
        }
      }
    };

    // Scroll reaction tracking (gentle wind drift on scroll)
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = (currentScrollY - lastScrollY) * 0.12;
      lastScrollY = currentScrollY;
    };

    if (interactive) {
      window.addEventListener("pointerdown", handlePointerDown, { passive: true });
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    // Animation Loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.667, 2.0);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Dampen scroll velocity smoothly
      scrollVelocity *= 0.90;

      // Update & Draw subtle ripples
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 4.5 * dt;
        sw.opacity *= 0.94;

        if (sw.radius >= sw.maxRadius || sw.opacity <= 0.01) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(101, 163, 13, ${sw.opacity * 0.18})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // Update & Draw Particles (Calm, non-distracting drift)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Handle Burst Particles
        if (p.isBurst && p.life !== undefined && p.maxLife !== undefined) {
          p.life -= dt;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.opacity = (p.life / p.maxLife) * 0.55;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
        }

        // Gentle horizontal sway (gentle leaf rocking, NOT circling)
        p.swayPhase += p.swaySpeed * dt;
        const swayFlutter = Math.sin(p.swayPhase) * 0.25;

        // Apply smooth drift velocities + scroll wind
        p.x += (p.vx + swayFlutter) * dt;
        p.y += (p.vy - scrollVelocity) * dt;

        // Smoothly restore base velocity
        p.vx += (p.baseVx - p.vx) * 0.02 * dt;
        p.vy += (p.baseVy - p.vy) * 0.02 * dt;

        // Shockwave impact
        for (const sw of shockwaves) {
          const dx = p.x - sw.x;
          const dy = p.y - sw.y;
          const dist = Math.hypot(dx, dy);
          if (Math.abs(dist - sw.radius) < 25 && dist > 1) {
            const push = (1 - Math.abs(dist - sw.radius) / 25) * sw.strength * 0.4;
            p.vx += (dx / dist) * push;
            p.vy += (dy / dist) * push;
          }
        }

        // Seamless wrap around edges (peaceful continuous flow)
        if (!p.isBurst) {
          if (p.y > height + 25) {
            p.y = -25;
            p.x = Math.random() * width;
          } else if (p.y < -30) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }

          if (p.x > width + 30) {
            p.x = -25;
            p.y = Math.random() * height;
          } else if (p.x < -30) {
            p.x = width + 25;
            p.y = Math.random() * height;
          }
        }

        // DRAW PARTICLE (Center-aligned to eliminate any circling/orbiting)
        ctx.save();
        ctx.translate(p.x, p.y);

        // Subtle rocking tilt (±6 degrees max), NO 360 spinning
        const tilt = p.baseAngle + Math.sin(p.swayPhase) * 0.1;
        ctx.rotate(tilt);

        const s = (p.size / 24) * p.scale;
        ctx.scale(s, s);
        ctx.globalAlpha = p.opacity;

        switch (p.type) {
          case "leaf":
            ctx.translate(-13, -12); // Center of 24x24 leaf path
            ctx.fillStyle = p.color;
            ctx.fill(leafPath);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.0;
            ctx.globalAlpha = p.opacity * 0.35;
            ctx.stroke(leafStemPath);
            break;

          case "sparkle":
            ctx.translate(-12, -12); // Center of 24x24 sparkle
            ctx.fillStyle = p.color;
            ctx.fill(sparklePath);
            break;

          case "sprout":
            ctx.translate(-12, -13); // Center of sprout
            ctx.fillStyle = p.color;
            ctx.fill(sproutLeft);
            ctx.fillStyle = "#0f766e";
            ctx.fill(sproutRight);
            ctx.strokeStyle = "#134e48";
            ctx.lineWidth = 1.4;
            ctx.stroke(sproutStem);
            break;

          case "dew":
            ctx.translate(-12, -13); // Center of dewdrop
            ctx.fillStyle = p.color;
            ctx.fill(dewPath);
            ctx.beginPath();
            ctx.arc(9.5, 14.5, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = p.opacity * 0.6;
            ctx.fill();
            break;

          case "seed":
            ctx.translate(-12, -12); // Center of winged seed
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(6, 18, 3.5, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = p.opacity * 0.45;
            ctx.fill(seedWing);
            break;

          case "breeze":
            ctx.translate(-23, -6.5); // Center of breeze curve
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.3;
            ctx.setLineDash([3, 4]);
            ctx.stroke(breezePath);
            ctx.beginPath();
            ctx.arc(43, 3, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            break;
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("pointerdown", handlePointerDown);
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [mounted, count, interactive]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 select-none ${className}`}
    />
  );
}
