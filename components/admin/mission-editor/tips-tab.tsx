"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

interface TipsTabProps {
  stepTips: Record<number, string>;
  onChange: (stepTips: Record<number, string>) => void;
}

const STEP_LABELS: Record<number, { name: string; desc: string }> = {
  1: { name: "Step 1: Identify Community Issues", desc: "Recognizing and defining the most pressing community problem" },
  2: { name: "Step 2: Analyze Causes", desc: "Examining root causes and contributing factors" },
  3: { name: "Step 3: Evaluate Digital Evidence", desc: "Assessing credibility, relevance, and reliability of digital sources" },
  4: { name: "Step 4: Consult Simulated Stakeholders", desc: "Gathering insights from community members and local leaders" },
  5: { name: "Step 5: Develop an Intervention Plan", desc: "Creating practical, evidence-based solutions for the identified issue" },
  6: { name: "Step 6: Anticipate Challenges", desc: "Responding to unexpected obstacles and revising strategy" },
  7: { name: "Step 7: Revise Plan", desc: "Refining and adapting the intervention plan based on simulation obstacles" },
  8: { name: "Step 8: Assess Community Impact", desc: "Evaluating feasibility, sustainability, effectiveness, and ethics" },
};

export function TipsTab({ stepTips, onChange }: TipsTabProps) {
  return (
    <TabsContent value="tips" className="m-0 w-full">
      <Card className="w-full border border-border shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary shrink-0" />
                <span>Custom Mission Guidance Tips per Step</span>
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                8 Steps
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Provide contextual pedagogical hints and guidance displayed to students at each step of the simulation.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
            const stepInfo = STEP_LABELS[num];
            return (
              <div key={num} className="p-3.5 border border-border rounded-lg bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                      {num}
                    </span>
                    <span className="font-semibold text-xs">{stepInfo.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">{stepInfo.desc}</span>
                </div>
                <Textarea
                  value={stepTips[num] || ""}
                  onChange={(e) => onChange({ ...stepTips, [num]: e.target.value })}
                  placeholder={`Enter tip for ${stepInfo.name}...`}
                  className="text-xs leading-relaxed bg-background"
                  rows={2}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
