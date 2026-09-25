"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  CivicCommunityActionHeroGraphic,
  EvidenceResearchStoryGraphic,
  StakeholderConsultationStoryGraphic,
} from "@/components/landing-graphics";
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

function FloatingLeaf({
  className,
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

function FloatingSprout({
  className,
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

function FloatingBreeze({
  className,
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

function FloatingSparkle({
  className,
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

function FloatingSeed({
  className,
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

function FloatingDewDrop({
  className,
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

function HeroNatureBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      <svg
        viewBox="0 0 1440 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0 w-full h-[400px] lg:h-[520px] object-cover opacity-35"
        preserveAspectRatio="none"
      >
        <path
          d="M0 500 C360 420, 720 520, 1080 440 C1250 400, 1370 430, 1440 440 L1440 680 L0 680 Z"
          fill="color-mix(in oklch, var(--secondary), transparent 84%)"
        />
        <circle cx="140" cy="460" r="85" fill="color-mix(in oklch, var(--primary), transparent 90%)" />
        <circle cx="250" cy="480" r="65" fill="color-mix(in oklch, var(--primary), transparent 92%)" />
        <circle cx="80" cy="490" r="55" fill="color-mix(in oklch, var(--primary), transparent 93%)" />
        <path
          d="M0 580 C420 560, 780 610, 1100 550 C1280 515, 1380 535, 1440 540 L1440 680 L0 680 Z"
          fill="color-mix(in oklch, var(--primary), transparent 95%)"
        />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

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
          className="relative flex min-h-[780px] items-center border-b border-border/70 px-5 py-16 sm:px-8 lg:min-h-[880px] lg:py-24"
        >
          {/* Nature Landscape Backdrop: Soft hills & foliage silhouettes */}
          <HeroNatureBackdrop />

          {/* Subtle civic grid and background parallax rings */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="landing-grid absolute inset-0 opacity-25" />

            <Parallax strength={0.03} className="absolute -right-40 top-10 size-[36rem] rounded-full border border-primary/20 sm:-right-20">
              <span />
            </Parallax>

            <Parallax strength={-0.025} className="absolute -left-36 bottom-10 size-96 rounded-full border border-border/60">
              <span />
            </Parallax>

            <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-border/40 to-transparent" />
          </div>

          {/* Atmospheric Floating Wind-Blown Elements (Parallax + Multi-Plane Drift) */}
          <Parallax strength={-0.05} className="pointer-events-none absolute top-20 left-12 z-20 hidden md:block">
            <FloatingLeaf size={24} color="#65a30d" animClass="leaf-anim-1" />
          </Parallax>
          <Parallax strength={0.09} className="pointer-events-none absolute bottom-28 left-1/4 z-20 hidden sm:block">
            <FloatingLeaf size={20} color="#f59e0b" animClass="leaf-anim-2" />
          </Parallax>
          <Parallax strength={-0.04} className="pointer-events-none absolute top-32 left-1/2 z-20">
            <FloatingLeaf size={18} color="#0f766e" animClass="leaf-anim-3" />
          </Parallax>
          <Parallax strength={0.12} className="pointer-events-none absolute bottom-36 right-1/3 z-20 hidden lg:block">
            <FloatingLeaf size={22} color="#65a30d" animClass="leaf-anim-1" />
          </Parallax>
          <Parallax strength={-0.08} className="pointer-events-none absolute top-16 right-1/4 z-20 hidden sm:block">
            <FloatingLeaf size={26} color="#f59e0b" animClass="leaf-anim-2" />
          </Parallax>
          <Parallax strength={0.16} className="pointer-events-none absolute top-1/2 right-12 z-20 hidden md:block">
            <FloatingLeaf size={19} color="#0f766e" animClass="leaf-anim-3" />
          </Parallax>

          {/* Inspiring Sparkles */}
          <Parallax strength={-0.07} className="pointer-events-none absolute top-14 left-1/3 z-20 hidden sm:block">
            <FloatingSparkle size={18} color="#f59e0b" animClass="sparkle-pulse" />
          </Parallax>
          <Parallax strength={0.14} className="pointer-events-none absolute top-10 right-1/3 z-20 hidden lg:block">
            <FloatingSparkle size={20} color="#0d9488" animClass="sparkle-pulse" />
          </Parallax>
          <Parallax strength={0.06} className="pointer-events-none absolute bottom-16 left-12 z-20 hidden md:block">
            <FloatingSparkle size={15} color="#fbbf24" animClass="sparkle-pulse" />
          </Parallax>

          {/* Seedlings & Sprouts */}
          <Parallax strength={0.08} className="pointer-events-none absolute bottom-20 left-1/3 z-20 hidden md:block">
            <FloatingSprout size={22} color="#65a30d" animClass="leaf-anim-2" />
          </Parallax>
          <Parallax strength={-0.06} className="pointer-events-none absolute bottom-24 right-16 z-20 hidden sm:block">
            <FloatingSprout size={20} color="#84cc16" animClass="leaf-anim-1" />
          </Parallax>

          {/* Wind Streamline Swirls */}
          <Parallax strength={-0.03} className="pointer-events-none absolute top-1/2 left-8 z-20 hidden lg:block">
            <FloatingBreeze width={48} height={14} color="#0f766e" animClass="float-gentle" />
          </Parallax>
          <Parallax strength={0.07} className="pointer-events-none absolute top-28 right-16 z-20 hidden md:block">
            <FloatingBreeze width={52} height={16} color="#65a30d" animClass="float-gentle" />
          </Parallax>

          {/* Winged Seed & Dew Droplets */}
          <Parallax strength={0.1} className="pointer-events-none absolute top-24 right-1/2 z-20 hidden sm:block">
            <FloatingSeed size={22} color="#d97706" animClass="seed-spin" />
          </Parallax>
          <Parallax strength={-0.09} className="pointer-events-none absolute bottom-32 left-16 z-20 hidden lg:block">
            <FloatingDewDrop size={16} color="#06b6d4" animClass="leaf-anim-3" />
          </Parallax>
          <Parallax strength={0.05} className="pointer-events-none absolute top-40 right-28 z-20 hidden lg:block">
            <FloatingDewDrop size={14} color="#0284c7" animClass="leaf-anim-1" />
          </Parallax>

          <div className="relative mx-auto w-full max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Heading, Subtitle, and CTAs */}
              <div className="relative z-20 text-center lg:col-span-6 lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <span>Civic Engagement Simulation</span>
                </div>

                <h1 className="mt-6 text-5xl font-black leading-[0.96] tracking-[-0.05em] sm:text-6xl lg:text-5xl xl:text-6xl">
                  Welcome to <span className="text-primary">Civi-Tech<span className="text-secondary">!</span></span>
                </h1>

                <p className="mt-6 text-base font-medium leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  A Web-Based Civic Engagement Simulation Platform for Community Problem-Solving in Senior High School Citizenship and Civic Engagement.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                  <Link
                    href="/login"
                    className={buttonVariants({
                      size: "lg",
                      className: "h-12 w-full px-8 text-sm font-bold shadow-xs sm:w-auto",
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
                      className: "h-12 w-full px-8 text-sm font-bold border-surface-border bg-card/80 sm:w-auto",
                    })}
                  >
                    <UserPlus className="size-4 text-primary" />
                    Register
                  </Link>
                </div>

                {/* Trust / Feature Chips */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-muted-foreground lg:justify-start">
                  <span className="info-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    8 Simulation Stages
                  </span>
                  <span className="info-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg">
                    <ShieldCheck className="size-3.5 text-secondary" />
                    Evidence-Based Solutions
                  </span>
                  <span className="info-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg">
                    <Users className="size-3.5 text-primary" />
                    Simulated Stakeholders
                  </span>
                </div>
              </div>

              {/* Right Column: Multi-Plane Parallax Scene with Flat Vector Community Action Graphic */}
              <div className="relative flex min-h-[460px] items-center justify-center lg:col-span-6 lg:min-h-[580px]">
                {/* Layer 1: Ambient Background Halo */}
                <Parallax strength={-0.04} className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div
                    style={{
                      transform: `translate3d(${mouseOffset.x * -16}px, ${mouseOffset.y * -16}px, 0)`,
                      transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    className="size-[34rem] rounded-full bg-gradient-to-tr from-primary/20 via-secondary/15 to-transparent blur-3xl opacity-75"
                  />
                </Parallax>

                {/* Layer 2: Main Flat Vector Community Action Graphic with Seamless Blended Canvas */}
                <div className="relative z-10 w-full flex items-center justify-center">
                  <CivicCommunityActionHeroGraphic mouseOffset={mouseOffset} />
                </div>

                {/* Layer 3: Floating Parallax Badges */}
                <Parallax strength={-0.08} className="pointer-events-none absolute top-4 right-2 z-20 sm:top-8 sm:right-6">
                  <div
                    style={{
                      transform: `translate3d(${mouseOffset.x * -18}px, ${mouseOffset.y * -18}px, 0)`,
                      transition: "transform 240ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    className="flex items-center gap-2 rounded-lg border border-primary/30 bg-card/90 px-3.5 py-1.5 shadow-sm backdrop-blur-md"
                  >
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold text-foreground">Community Problem-Solving</span>
                  </div>
                </Parallax>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: Community Partnerships & Civic Solutions (Seamless Visual Story) */}
        {/* ========================================================================= */}
        <section className="relative border-b border-border/70 overflow-hidden bg-background px-5 py-24 sm:px-8 lg:py-32">
          {/* Environmental Landscape Backdrop Waves */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
            <svg
              className="absolute bottom-0 left-0 w-full h-[320px] text-primary/[0.04]"
              preserveAspectRatio="none"
              viewBox="0 0 1440 320"
              fill="currentColor"
            >
              <path d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,224C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>
            <svg
              className="absolute bottom-0 left-0 w-full h-[200px] text-secondary/[0.07]"
              preserveAspectRatio="none"
              viewBox="0 0 1440 200"
              fill="currentColor"
            >
              <path d="M0,96L60,112C120,128,240,160,360,160C480,160,600,128,720,117.3C840,107,960,117,1080,128C1200,139,1320,149,1380,154.7L1440,160L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z" />
            </svg>
          </div>

          {/* Environmental floating leaves */}
          <Parallax strength={0.07} className="pointer-events-none absolute top-12 left-8 z-10 hidden sm:block">
            <FloatingLeaf size={22} color="#65a30d" animClass="leaf-anim-1" />
          </Parallax>
          <Parallax strength={-0.06} className="pointer-events-none absolute top-28 right-16 z-10 hidden md:block">
            <FloatingLeaf size={20} color="#f59e0b" animClass="leaf-anim-3" />
          </Parallax>
          <Parallax strength={0.08} className="pointer-events-none absolute bottom-24 left-1/3 z-10 hidden lg:block">
            <FloatingLeaf size={18} color="#84cc16" animClass="leaf-anim-2" />
          </Parallax>
          <Parallax strength={-0.05} className="pointer-events-none absolute bottom-16 right-12 z-10 hidden lg:block">
            <FloatingLeaf size={24} color="#134e48" animClass="leaf-anim-1" />
          </Parallax>

          <div className="relative z-10 mx-auto max-w-7xl">
            {/* Header with pill badge and educational intro */}
            <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6">
                <div className="section-label">
                  <Users className="size-3.5 text-primary" />
                  <span>Community Partnerships</span>
                </div>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  Collaborative Long-Term Solutions
                </h2>
              </div>
              <div className="lg:col-span-6">
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  By working closely with local stakeholders, students expand civic reach, scrutinize digital evidence, and build sustainable community solutions that serve barangays for years.
                </p>
              </div>
            </div>

            {/* Two Side-by-Side Visual Story Blocks with Matching Flat Color Community Illustrations */}
            <div className="mt-16 grid gap-12 md:grid-cols-2 lg:gap-20">
              {/* Story 1: Evidence & Data Investigation (Matching Flat Vector Graphic with Seamless Blended Edges) */}
              <div className="group relative flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative flex min-h-[320px] w-full items-center justify-center p-2">
                  <EvidenceResearchStoryGraphic />
                </div>
                <div className="mt-6 w-full pt-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                    Stages 01–03
                  </div>
                  <h3 className="mt-3 text-2xl font-black text-foreground">
                    Evidence-Based Problem Identification
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Students analyze local root causes, examine community data trends, and verify the credibility of digital sources before formulating proposals.
                  </p>
                </div>
              </div>

              {/* Story 2: Stakeholder Dialogue & Community Action (Matching Flat Vector Graphic with Seamless Blended Edges) */}
              <div className="group relative flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative flex min-h-[320px] w-full items-center justify-center p-2">
                  <StakeholderConsultationStoryGraphic />
                </div>
                <div className="mt-6 w-full pt-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-secondary/35 bg-secondary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">
                    Stages 04–08
                  </div>
                  <h3 className="mt-3 text-2xl font-black text-foreground">
                    Simulated Stakeholder Consultations
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Engage with simulated barangay captains, local organizations, and citizens to adapt intervention plans and assess long-term social impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
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
