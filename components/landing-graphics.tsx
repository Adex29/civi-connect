"use client";

import React from "react";
import Image from "next/image";

/**
 * 1. HERO COMMUNITY GRAPHIC: "Community Tree-Planting & Civic Action"
 * Theme: Community Action & Flat Colors
 * High-end flat vector illustration on a seamless light background:
 * - Volunteers planting young saplings, raking, bagging leaves, watering, and mentoring
 * - Framed by a soft organic fluid pastel blob and blooming white daisies
 * - Seamless border-fade to guarantee zero boxy edges, zero card borders, and no crude geometric shapes
 */
export function CivicCommunityActionHeroGraphic({
  mouseOffset = { x: 0, y: 0 },
}: {
  mouseOffset?: { x: number; y: number };
}) {
  return (
    <div className="relative w-full max-w-[680px] select-none">
      {/* Subtle Aura for soft depth */}
      <div className="pointer-events-none absolute -inset-6 rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-amber-500/5 blur-3xl opacity-60" />

      {/* Parallax Container */}
      <div
        style={{
          transform: `translate3d(${mouseOffset.x * 10}px, ${mouseOffset.y * 10}px, 0)`,
          transition: "transform 240ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative z-10 flex items-center justify-center"
      >
        <Image
          src="/images/community-action-flat-hero.png"
          alt="High school youth volunteers engaged in community environmental cleanup, tree planting, and civic action"
          width={1376}
          height={768}
          priority
          className="h-auto w-full object-contain select-none drop-shadow-xs"
        />
      </div>
    </div>
  );
}

/**
 * 2. STORY 1 GRAPHIC: "Evidence-Based Problem Identification" (Stages 01–03)
 * Theme: Community Evidence & Investigation with Flat Colors
 * High-end flat vector illustration on a seamless light background:
 * - Student researchers inspecting field soil/water samples with magnifying glass & digital tablet
 * - Research easel with community map and verified data charts
 * - Framed by a soft organic fluid pastel blob and white daisies
 * - Seamless border-fade with zero boxy edges
 */
export function EvidenceResearchStoryGraphic() {
  return (
    <div className="relative flex w-full max-w-[540px] items-center justify-center select-none">
      <div className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/10 via-teal-500/5 to-transparent blur-2xl opacity-50" />
      <Image
        src="/images/community-evidence-flat.png"
        alt="High school students investigating community data and environmental evidence"
        width={1376}
        height={768}
        className="relative z-10 h-auto w-full object-contain select-none drop-shadow-xs"
      />
    </div>
  );
}

/**
 * 3. STORY 2 GRAPHIC: "Simulated Stakeholder Consultations" (Stages 04–08)
 * Theme: Community Dialogue & Consensus with Flat Colors
 * High-end flat vector illustration on a seamless light background:
 * - Diverse community stakeholders and students collaborating around a table with a project map
 * - Framed by a soft organic fluid background and speech bubbles
 * - Seamless border-fade with zero boxy edges
 */
export function StakeholderConsultationStoryGraphic() {
  return (
    <div className="relative flex w-full max-w-[540px] items-center justify-center select-none">
      <div className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-tr from-secondary/10 via-amber-500/5 to-transparent blur-2xl opacity-50" />
      <Image
        src="/images/community-stakeholders-flat.png"
        alt="Diverse community stakeholders and students collaborating around a round table"
        width={1200}
        height={896}
        className="relative z-10 h-auto w-full object-contain select-none drop-shadow-xs"
      />
    </div>
  );
}

// Backwards-compatible aliases
export const CivicEcosystemGraphic = CivicCommunityActionHeroGraphic;
export const EvidenceRadarGraphic = EvidenceResearchStoryGraphic;
export const StakeholderNexusGraphic = StakeholderConsultationStoryGraphic;
