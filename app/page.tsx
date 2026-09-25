"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Parallax } from "@/components/parallax";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Lightbulb,
  ListOrdered,
  LogIn,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  Target,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";

const steps = [
  { num: "01", name: "Identify Community Issues", desc: "Recognize and define the most pressing community problem.", icon: Search, badge: "Investigation" },
  { num: "02", name: "Analyze Causes", desc: "Examine the root causes and contributing factors.", icon: ListOrdered, badge: "Analysis" },
  { num: "03", name: "Evaluate Digital Evidence", desc: "Assess the credibility, relevance, and reliability of different digital sources before making decisions.", icon: FileCheck, badge: "Verification" },
  { num: "04", name: "Consult Simulated Stakeholders", desc: "Gather insights from community members, local leaders, and organizations through realistic simulations.", icon: Users, badge: "Consultation" },
  { num: "05", name: "Community Action Planning", desc: "Create practical, evidence-based solutions for the identified community issue.", icon: Lightbulb, badge: "Planning" },
  { num: "06", name: "Anticipate Challenges", desc: "Respond to unexpected obstacles and revise your plan accordingly.", icon: Zap, badge: "Adaptation" },
  { num: "07", name: "Revise Plan", desc: "Refine and adapt your intervention plan based on the simulation obstacle.", icon: RefreshCw, badge: "Revision" },
  { num: "08", name: "Assess Community Impact", desc: "Evaluate the feasibility, sustainability, effectiveness, and ethical implications of your proposed solution.", icon: Target, badge: "Evaluation" },
];

function HeroPageOneBackground({
  mouseOffset = { x: 0, y: 0 },
  scrollY = 0,
}: {
  mouseOffset?: { x: number; y: number };
  scrollY?: number;
}) {
  // Camera depth scale & parallax translations for an immersive 3D fly-in feel
  const bgScale = 1 + Math.min(0.14, scrollY * 0.00035);
  const bgTranslateY = scrollY * 0.16;
  const glowScale = 1 + Math.min(0.25, scrollY * 0.0004);
  const glowOpacity = Math.max(0.2, 0.75 - (scrollY / 600) * 0.45);
  const overlayOpacity = Math.max(0.35, 1 - (scrollY / 700) * 0.65);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {/* Soft atmospheric gradient wash across the top so text has pristine contrast */}
      <div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/70 to-transparent z-10 transition-opacity"
      />

      {/* Ambient radial glow centered behind headline - expands and deepens with scroll */}
      <div
        style={{
          transform: `translate3d(calc(-50% + ${mouseOffset.x * 12}px), ${mouseOffset.y * 8}px, 0) scale(${glowScale})`,
          opacity: glowOpacity,
        }}
        className="absolute top-4 left-1/2 w-[48rem] h-[24rem] rounded-full bg-gradient-to-b from-primary/25 via-secondary/15 to-transparent blur-3xl z-10 pointer-events-none will-change-transform"
      />

      {/* 1.svg Community Youth Solidarity Illustration Background with Dynamic Camera Parallax */}
      <div
        style={{
          transform: `translate3d(${mouseOffset.x * -10}px, ${bgTranslateY + mouseOffset.y * -6}px, 0) scale(${bgScale})`,
          transformOrigin: "bottom center",
          transition: "transform 180ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
        className="absolute inset-x-0 bottom-0 flex items-end justify-center z-0"
      >
        <img
          src="/1.svg"
          alt=""
          className="w-full max-w-[1240px] h-[280px] sm:h-[350px] md:h-[400px] lg:h-[440px] object-contain object-bottom opacity-90 dark:opacity-55 transition-opacity duration-300 drop-shadow-sm"
        />
      </div>

      {/* Subtle bottom fade to seamlessly blend into next section border */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/75 to-transparent z-10" />
    </div>
  );
}

function ImmersiveShowcaseCard({
  imageSrc,
  imageAlt,
  title,
  description,
  accentColor = "primary",
  parallaxOffset = 0,
}: {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  accentColor?: "primary" | "secondary";
  parallaxOffset?: number;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, mouseX: 0, mouseY: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Subtle, elegant 3D tilt max +/- 4 degrees
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTilt({ x: rotateX, y: rotateY, mouseX: x, mouseY: y, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, mouseX: 0, mouseY: 0, active: false });
  };

  const isPrimary = accentColor === "primary";

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translate3d(0, ${parallaxOffset}px, 0) scale3d(${
          tilt.active ? 1.015 : 1
        }, ${tilt.active ? 1.015 : 1}, 1)`,
        transition: tilt.active
          ? "transform 0.12s ease-out, border-color 0.3s ease, box-shadow 0.3s ease"
          : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border ${
        tilt.active
          ? isPrimary
            ? "border-primary/55 shadow-2xl"
            : "border-secondary/55 shadow-2xl"
          : "border-border/70 shadow-md"
      } bg-card/85 p-6 sm:p-8 backdrop-blur-2xl transition-all duration-500`}
    >
      {/* Dynamic Interactive Specular Spotlight Sheen */}
      {tilt.active && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(450px circle at ${tilt.mouseX}px ${tilt.mouseY}px, ${
              isPrimary ? "rgba(13, 122, 117, 0.14)" : "rgba(34, 197, 94, 0.14)"
            }, transparent 80%)`,
          }}
        />
      )}

      {/* Ambient Backlight Glow behind illustration */}
      <div
        className={`pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full ${
          isPrimary ? "bg-primary/20 dark:bg-primary/30" : "bg-secondary/25 dark:bg-secondary/35"
        } blur-3xl opacity-70 transition-opacity duration-500 group-hover:opacity-100`}
      />

      {/* Artwork Canvas with 3D Pop Elevation */}
      <div
        style={{
          transform: `translateZ(${tilt.active ? "28px" : "0px"})`,
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative flex min-h-[300px] sm:min-h-[340px] md:min-h-[380px] w-full items-center justify-center overflow-hidden rounded-2xl dark:bg-radial dark:from-white/[0.04] dark:to-transparent"
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="relative z-10 max-h-[300px] sm:max-h-[340px] md:max-h-[370px] w-auto max-w-full object-contain drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-[1.04] select-none"
          style={{
            maskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
          }}
        />
      </div>

      {/* Card Text Content with 3D Layering */}
      <div
        style={{
          transform: `translateZ(${tilt.active ? "16px" : "0px"})`,
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative z-10 mt-6 flex flex-col"
      >
        <h3 className="text-2xl font-black text-foreground sm:text-3xl transition-colors duration-300">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setMouseOffset({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <main>
        {/* ========================================================================= */}
        {/* HERO SECTION: Immersive Educational Parallax Hub                         */}
        {/* ========================================================================= */}
        <section
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex min-h-[720px] sm:min-h-[780px] lg:min-h-[840px] flex-col justify-between items-center border-b border-border/70 px-5 pt-10 pb-0 sm:px-8 sm:pt-14 lg:pt-16 overflow-hidden"
        >
          {/* Custom SVG Background for Page One with Dynamic Parallax & Camera Depth */}
          <HeroPageOneBackground mouseOffset={mouseOffset} scrollY={scrollY} />

          {/* Subtle civic grid and background parallax rings */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              style={{ transform: `translate3d(0, ${scrollY * 0.06}px, 0)` }}
              className="landing-grid absolute inset-0 opacity-20 will-change-transform"
            />

            <div
              style={{ transform: `translate3d(0, ${scrollY * 0.18}px, 0)` }}
              className="absolute -right-40 top-10 size-[36rem] rounded-full border border-primary/20 sm:-right-20 will-change-transform"
            >
              <span />
            </div>

            <div
              style={{ transform: `translate3d(0, ${scrollY * 0.08}px, 0)` }}
              className="absolute -left-36 bottom-10 size-96 rounded-full border border-border/60 will-change-transform"
            >
              <span />
            </div>

            <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-border/40 to-transparent" />
          </div>

          {/* Main Hero Elements (Centered & Balanced with 3D Depth-of-Field Parallax) */}
          <div
            style={{
              transform: `translate3d(0, ${scrollY * -0.28}px, 0) scale(${Math.max(0.92, 1 - scrollY * 0.00035)})`,
              opacity: Math.max(0, 1 - scrollY / 440),
              filter: scrollY > 20 ? `blur(${Math.min(6, ((scrollY - 20) / 420) * 6)}px)` : "none",
              pointerEvents: scrollY > 380 ? "none" : "auto",
              willChange: "transform, opacity, filter",
            }}
            className="relative z-20 mx-auto w-full max-w-4xl text-center"
          >
            {/* Heading */}
            <h1 className="mt-2 text-4xl font-black leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl xl:text-7xl">
              Welcome to <span className="text-primary">Civi-Tech<span className="text-secondary">!</span></span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
              A Web-Based Civic Engagement Simulation Platform for Community Problem-Solving in Senior High School Citizenship and Civic Engagement.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className={buttonVariants({
                  size: "lg",
                  className: "h-11 w-full px-8 text-sm font-bold shadow-md sm:w-auto",
                })}
              >
                <LogIn className="size-4" />
                Log In
              </Link>
              <Link
                href="/register"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-11 w-full px-8 text-sm font-bold border-surface-border bg-card/85 backdrop-blur-md shadow-xs sm:w-auto",
                })}
              >
                <UserPlus className="size-4 text-primary" />
                Register
              </Link>
            </div>

            {/* Trust / Feature Chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs font-semibold text-muted-foreground">
              <span className="info-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-card/80 backdrop-blur-md shadow-xs">
                <CheckCircle2 className="size-3.5 text-primary" />
                8 Simulation Stages
              </span>
              <span className="info-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-card/80 backdrop-blur-md shadow-xs">
                <ShieldCheck className="size-3.5 text-secondary" />
                Evidence-Based Solutions
              </span>
              <span className="info-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-card/80 backdrop-blur-md shadow-xs">
                <Users className="size-3.5 text-primary" />
                Simulated Stakeholders
              </span>
            </div>
          </div>

          {/* Immersive Scroll Prompt / Discover Indicator */}
          <div
            style={{
              opacity: Math.max(0, 1 - scrollY / 90),
              transform: `translate3d(-50%, ${scrollY * -0.5}px, 0)`,
            }}
            className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex flex-col items-center gap-1.5 transition-opacity duration-200 select-none"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">
              Scroll to explore
            </span>
            <div className="relative flex h-7 w-4.5 justify-center rounded-full border-2 border-primary/40 bg-card/50 p-1 backdrop-blur-xs">
              <div className="h-1.5 w-1 animate-bounce rounded-full bg-primary" />
            </div>
          </div>

          {/* Spacer allowing the solidarity background illustration full visual prominence */}
          <div className="relative z-10 w-full h-[220px] sm:h-[280px] lg:h-[340px] pointer-events-none" />
        </section>

        {/* ========================================================================= */}
        {/* SECTION: Community Partnerships & Civic Solutions (Seamless Visual Story) */}
        {/* ========================================================================= */}
        <section className="relative border-b border-border/70 overflow-hidden bg-background px-5 py-24 sm:px-8 lg:py-32">
          {/* Environmental Landscape Backdrop Waves with Scroll Parallax */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
            <svg
              style={{ transform: `translate3d(0, ${scrollY * 0.04}px, 0)` }}
              className="absolute bottom-0 left-0 w-full h-[320px] text-primary/[0.04] will-change-transform"
              preserveAspectRatio="none"
              viewBox="0 0 1440 320"
              fill="currentColor"
            >
              <path d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,224C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>
            <svg
              style={{ transform: `translate3d(0, ${scrollY * 0.07}px, 0)` }}
              className="absolute bottom-0 left-0 w-full h-[200px] text-secondary/[0.07] will-change-transform"
              preserveAspectRatio="none"
              viewBox="0 0 1440 200"
              fill="currentColor"
            >
              <path d="M0,96L60,112C120,128,240,160,360,160C480,160,600,128,720,117.3C840,107,960,117,1080,128C1200,139,1320,149,1380,154.7L1440,160L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z" />
            </svg>
          </div>

          {/* Atmospheric Civic Background Panorama with Gentle Parallax Floating */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-20 dark:opacity-10">
            <div
              style={{ transform: `translate3d(0, ${(scrollY - 700) * 0.05}px, 0)` }}
              className="absolute -left-20 top-20 h-[520px] w-[620px] -rotate-3 rounded-full bg-radial from-primary/20 to-transparent blur-3xl will-change-transform"
            />
            <div
              style={{ transform: `translate3d(0, ${(scrollY - 700) * 0.08}px, 0)` }}
              className="absolute -right-20 bottom-10 h-[520px] w-[620px] rotate-3 rounded-full bg-radial from-secondary/25 to-transparent blur-3xl will-change-transform"
            />
            <img
              src="/2.png"
              alt=""
              aria-hidden="true"
              style={{
                transform: `translate3d(0, ${(scrollY - 750) * 0.08}px, 0)`,
                maskImage: 'radial-gradient(circle, black 40%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 80%)',
              }}
              className="absolute -left-24 top-28 h-[420px] w-auto object-contain opacity-25 filter blur-[2px] will-change-transform"
            />
            <img
              src="/o.png"
              alt=""
              aria-hidden="true"
              style={{
                transform: `translate3d(0, ${(scrollY - 750) * 0.12}px, 0)`,
                maskImage: 'radial-gradient(circle, black 40%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 80%)',
              }}
              className="absolute -right-24 bottom-16 h-[420px] w-auto object-contain opacity-25 filter blur-[2px] will-change-transform"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl">
            {/* Header with Smooth Depth Float */}
            <div
              style={{
                transform: `translate3d(0, ${Math.max(-20, Math.min(20, (scrollY - 700) * -0.04))}px, 0)`,
              }}
              className="mx-auto max-w-3xl text-center will-change-transform"
            >
              <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Collaborative Long-Term Solutions
              </h2>
            </div>

            {/* Two Balanced Showcase Cards with Immersive 3D Tilt & Specular Physics */}
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:gap-10">
              <ImmersiveShowcaseCard
                imageSrc="/2.png"
                imageAlt="Simulated Stakeholder Consultations & Deliberation"
                title="Evidence-Based Stakeholder Deliberation"
                description="Engage with simulated barangay captains, local organizations, and citizens to analyze root causes, scrutinize community evidence, and deliberate on realistic interventions."
                accentColor="primary"
                parallaxOffset={Math.max(-25, Math.min(25, (scrollY - 750) * -0.035))}
              />

              <ImmersiveShowcaseCard
                imageSrc="/o.png"
                imageAlt="Collaborative Community Action & Solutions"
                title="Collaborative Community Action"
                description="Put evidence-based proposals into concrete practice. Mobilize community cleanups, tree-planting, waste reduction, and civic infrastructure plans that create measurable barangay impact."
                accentColor="secondary"
                parallaxOffset={Math.max(-35, Math.min(35, (scrollY - 750) * -0.06))}
              />
            </div>
          </div>
        </section>

        {/* SECTION: What You Will Do? (8 Critical Simulation Stages)                 */}
        {/* ========================================================================= */}
        <section id="stages" className="px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="page-title text-4xl sm:text-5xl">What You Will Do?</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                Follow these 8 critical simulation stages to analyze, design, and validate evidence-based solutions for local communities.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <article
                    key={step.num}
                    className="surface-panel surface-interactive group relative z-10 flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-2xl font-black text-primary/40 transition-colors group-hover:text-primary">
                          {step.num}
                        </span>
                        <span className="status-label rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">
                          {step.badge}
                        </span>
                      </div>

                      <div className="mt-6 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-sm">
                          <Icon className="size-5" />
                        </div>
                        <h3 className="text-base font-extrabold leading-snug text-foreground">
                          {step.name}
                        </h3>
                      </div>

                      <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3 text-[10px] font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      <span>Phase {step.num}</span>
                      <span className="text-muted-foreground/60">Stage {step.num} / 08</span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Breathing Button: Start Simulation */}
            <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
              <div className="flex items-center gap-3">
                <Link
                  href="/register"
                  className={buttonVariants({
                    size: "lg",
                    className: "breathing-btn group h-12 px-9 text-base font-bold tracking-wide gap-2.5 shadow-md",
                  })}
                >
                  <Play className="size-4 fill-current transition-transform duration-300 group-hover:scale-110" />
                  <span>Start Simulation</span>
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                Join your classroom and begin your first civic engagement mission.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/70 bg-card px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary/12 font-mono text-[10px] text-primary">CT</span>
            <span>Civi-Tech &copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-center sm:text-right">Empowering students to solve real-world community issues.</p>
        </div>
      </footer>
    </div>
  );
}
