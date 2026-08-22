"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, BookOpen, Target, CheckCircle2, ShieldCheck } from "lucide-react";
import { Scenario } from "@/lib/definitions";
import Link from "next/link";

export interface MissionBriefingProps {
  scenario: Scenario;
  studentName?: string;
  currentStep: number;
  isCompleted?: boolean;
  onStart: () => void;
}

export function MissionBriefing({
  scenario,
  studentName = "Student",
  currentStep,
  isCompleted = false,
  onStart,
}: MissionBriefingProps) {
  const [stage, setStage] = useState<"welcome" | "overview">("welcome");

  // Calculate percentage: Step 1 = 0%, Step 4 = ~38%, Step 8 = ~88%, Completed = 100%
  const progressPercent = isCompleted
    ? 100
    : currentStep <= 1
    ? 0
    : Math.min(Math.round(((currentStep - 1) / 8) * 100), 95);

  const isResuming = currentStep > 1 && !isCompleted;

  // --- STAGE 1: Welcome / Mission Splash Screen ---
  if (stage === "welcome") {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fade-in-up">
        <Card className="border border-border shadow-xl bg-card overflow-hidden">
          <CardContent className="p-8 sm:p-14 text-center space-y-8 flex flex-col items-center justify-center min-h-[440px]">
            {/* Top Greeting Badge */}
            <div className="text-xs sm:text-sm font-mono font-semibold text-primary tracking-wide">
              [{studentName}, here is your mission:]
            </div>

            {/* Main Mission Title */}
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
                Mission: <br className="hidden sm:inline" />
                <span className="text-primary">{scenario.title}</span>
              </h1>
            </div>

            {/* Progress Section */}
            <div className="space-y-2.5 w-full max-w-xs pt-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 bg-muted" />
              {isResuming && (
                <p className="text-[11px] text-muted-foreground">
                  Resuming at Step 0{currentStep} of 08
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 w-full sm:w-auto">
              <Button
                size="lg"
                onClick={() => setStage("overview")}
                className="w-full sm:w-auto px-8 py-3 text-sm font-bold gap-2 shadow-md"
              >
                {isCompleted
                  ? "Review Mission"
                  : isResuming
                  ? "Continue Mission"
                  : "Start Mission"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- STAGE 2: Mission Overview & Objective Screen ---
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fade-in-up">
      <Card className="border border-border shadow-xl bg-card overflow-hidden">
        {/* Header Title Bar */}
        <div className="p-6 sm:p-8 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge className="bg-primary text-primary-foreground font-mono text-[10px]">
              Civic Mission Briefing
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground uppercase">
            MISSION: {scenario.title}
          </h1>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Overview Section */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Overview
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {scenario.description}
            </p>
          </div>

          {/* Legal / Statutory Context if present */}
          {scenario.context && (
            <div className="p-3.5 rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Statutory / Policy Context:
              </span>
              <p className="leading-relaxed italic">{scenario.context}</p>
            </div>
          )}

          {/* Mission Objective Section */}
          <div className="space-y-2 border-t border-border pt-4">
            <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Mission Objective
            </h3>
            <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
              Develop an evidence-based and sustainable intervention.
            </p>
          </div>

          {/* Key Requirements & Constraints */}
          {scenario.constraints && scenario.constraints.length > 0 && (
            <div className="space-y-2 border-t border-border pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Key Requirements & Constraints
              </span>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 pl-1">
                {scenario.constraints.map((c, i) => (
                  <li key={i} className="leading-relaxed">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="border-t border-border pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setStage("welcome")}
              className="w-full sm:w-auto text-xs gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>

            <Button
              onClick={onStart}
              className="w-full sm:w-auto px-6 text-xs sm:text-sm font-bold gap-2 shadow-md"
            >
              {isCompleted
                ? "View Simulation Steps"
                : isResuming
                ? "Continue Investigation"
                : "Start Investigation"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
