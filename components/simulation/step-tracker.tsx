"use client";

import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scenario } from "@/lib/definitions";
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
} from "@/components/ui/timeline";

export interface StepTrackerProps {
  currentStep: number; // 1 to 7
  scenario: Scenario;
  completedSteps?: number[];
  onSelectStep?: (step: number) => void;
}

export const STEPS_CONFIG = [
  { step: 1, name: "Identify Issue", desc: "Recognize & define community problem" },
  { step: 2, name: "Analyze Causes", desc: "Order root causes & contributing factors" },
  { step: 3, name: "Evidence Evaluation", desc: "Assess digital sources & credibility" },
  { step: 4, name: "Stakeholder Consultation", desc: "Gather insights from community members" },
  { step: 5, name: "Intervention Planning", desc: "Develop evidence-based action plan" },
  { step: 6, name: "Challenge Simulation", desc: "Respond to unexpected obstacles" },
  { step: 7, name: "Impact Assessment", desc: "Evaluate sustainability & ethics" },
];

export function StepTracker({ currentStep, scenario, completedSteps = [], onSelectStep }: StepTrackerProps) {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Mobile-Only Horizontal Scrollable Progress Bar */}
      <div className="block lg:hidden bg-card border border-border rounded-xl p-3 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-primary uppercase tracking-wider">Mission Progress</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
            Step {Math.min(currentStep, 7)} of 7
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap">
          {STEPS_CONFIG.map((s) => {
            const isCurrent = currentStep === s.step;
            const isDone = completedSteps.includes(s.step) || currentStep > s.step;
            const isClickable = onSelectStep !== undefined && (isDone || isCurrent);

            return (
              <div
                key={s.step}
                onClick={() => isClickable && onSelectStep!(s.step)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                  isClickable ? "cursor-pointer hover:opacity-90" : ""
                } ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isDone
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground opacity-60"
                }`}
              >
                <span>{s.step}.</span>
                <span>{s.name}</span>
                {isDone && <CheckCircle2 className="h-3 w-3 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Vertical Progress Timeline */}
      <Card className="hidden lg:block border-primary/20 bg-card shadow-sm">
        <CardHeader className="pb-3 border-b border-border bg-muted/30">
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span>Mission Timeline</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              {Math.min(currentStep, 7)} / 7
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 px-5">
          <Timeline>
            {STEPS_CONFIG.map((s) => {
              const isCurrent = currentStep === s.step;
              const isDone = completedSteps.includes(s.step) || currentStep > s.step;
              const isClickable = onSelectStep !== undefined && (isDone || isCurrent);
              const status = isDone ? "completed" : isCurrent ? "current" : "upcoming";

              return (
                <TimelineItem
                  key={s.step}
                  onClick={() => isClickable && onSelectStep!(s.step)}
                  className={`transition-all duration-200 ${
                    isClickable ? "cursor-pointer hover:bg-muted/40 rounded-lg p-1.5 -mx-1.5" : ""
                  }`}
                >
                  <TimelineDot status={status}>
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : isCurrent ? (
                      <ArrowRight className="h-3.5 w-3.5 text-primary-foreground" />
                    ) : (
                      <span className="text-[11px]">{s.step}</span>
                    )}
                  </TimelineDot>
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineHeader>
                      <TimelineTitle className={isCurrent ? "text-primary font-extrabold" : ""}>
                        {s.name}
                      </TimelineTitle>
                    </TimelineHeader>
                    <TimelineDescription>{s.desc}</TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </CardContent>
      </Card>

      {/* Scenario Guidance Box */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-2 border-b border-border bg-muted/20">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Scenario Context & Legal Guidance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 text-xs leading-relaxed space-y-3">
          <h4 className="font-bold text-sm text-foreground">{scenario.title}</h4>
          <p className="text-muted-foreground">{scenario.description}</p>
          {scenario.context && (
            <div className="pt-2 border-t border-border text-muted-foreground italic">
              <span className="font-semibold not-italic block mb-1 text-foreground">Legal & Statutory Framework:</span>
              {scenario.context}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
