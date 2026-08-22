"use client";

import React from "react";
import { Trophy, CheckCircle2, Award, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepScoreBreakdown } from "@/lib/definitions";
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
  TimelineContent,
} from "@/components/ui/timeline";

export interface PerformanceReportProps {
  scores: StepScoreBreakdown;
  studentName: string;
  onContinueToReflection: () => void;
  onBack?: () => void;
}

export function PerformanceReport({ scores, studentName, onContinueToReflection, onBack }: PerformanceReportProps) {
  const categories = [
    { step: 1, label: "Community Investigation", score: scores.communityInvestigation, desc: "Accuracy in identifying community issues and local context" },
    { step: 2, label: "Evidence Evaluation", score: scores.evidenceEvaluation, desc: "Critical assessment, credibility rating, and linking of sources" },
    { step: 3, label: "Stakeholder Analysis", score: scores.stakeholderAnalysis, desc: "Inclusivity and synthesis of diverse community viewpoints" },
    { step: 4, label: "Intervention Planning", score: scores.interventionPlanning, desc: "Feasibility, completeness, and initial budget/timeline realism" },
    { step: 5, label: "Adaptive Decision-Making", score: scores.adaptiveDecisionMaking, desc: "Flexibility and problem-solving under sudden obstacles" },
    { step: 6, label: "Adaptive Plan Revision", score: scores.planRevision || scores.interventionPlanning, desc: "Resilient refinement and optimization of the action plan" },
    { step: 7, label: "Impact Assessment", score: scores.impactAssessment, desc: "Long-term sustainability, reach, and ethical mitigations" },
  ];

  return (
    <Card className="max-w-2xl mx-auto border shadow-lg overflow-hidden animate-fade-in-up">
      <CardHeader className="bg-primary text-primary-foreground text-center py-8 relative">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-3">
          <Trophy className="h-10 w-10 text-amber-300 animate-bounce" />
        </div>
        <CardTitle className="text-3xl font-extrabold tracking-tight">MISSION COMPLETE</CardTitle>
        <CardDescription className="text-primary-foreground/80 text-sm mt-1">
          Performance Dashboard & Evaluation Summary
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Overall Score Badge */}
        <div className="flex flex-col items-center justify-center p-6 bg-muted/40 rounded-xl border text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Overall Civic Decision Score
          </span>
          <span className="text-5xl font-black text-primary mt-2">{scores.overallScore}%</span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Passed Senior High School Civic Competency Standard
          </span>
        </div>

        {/* 8-Step Performance Timeline Audit */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            8-Step Competency Evaluation Timeline
          </h4>
          <Timeline className="pt-2">
            {categories.map((cat) => (
              <TimelineItem key={cat.step}>
                <TimelineDot status="completed">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </TimelineDot>
                <TimelineConnector />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>{cat.label}</TimelineTitle>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {cat.score}%
                    </span>
                  </TimelineHeader>
                  <TimelineDescription>{cat.desc}</TimelineDescription>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-2">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t p-4 flex justify-between gap-4">
        {onBack ? (
          <Button variant="outline" onClick={onBack}>
            Back to Step 8
          </Button>
        ) : (
          <div />
        )}
        <Button onClick={onContinueToReflection} className="gap-2 font-bold px-6">
          Proceed to Final Reflection <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
