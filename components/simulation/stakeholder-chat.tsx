"use client";

import React, { useState } from "react";
import { User, MessageSquare, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Stakeholder } from "@/lib/definitions";

export interface StakeholderChatProps {
  stakeholders: Stakeholder[];
  notes: string;
  onNotesChange: (notes: string) => void;
  askedFollowUps: Record<string, number[]>; // stakeholderId -> indices
  onAskFollowUp: (stakeholderId: string, followUpIndex: number) => void;
  disabled?: boolean;
}

export function StakeholderChat({
  stakeholders,
  notes,
  onNotesChange,
  askedFollowUps,
  onAskFollowUp,
  disabled,
}: StakeholderChatProps) {
  const [activeStakeholderId, setActiveStakeholderId] = useState<string>(
    stakeholders[0]?.id || ""
  );

  const activeStakeholder = stakeholders.find((s) => s.id === activeStakeholderId) || stakeholders[0];
  const activeAsked = askedFollowUps[activeStakeholder?.id || ""] || [];

  return (
    <div className="space-y-6">
      {/* Top Section: Stakeholder Selector Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Stakeholder to Interview</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stakeholders.map((s) => {
            const isSelected = s.id === activeStakeholderId;
            const askedCount = (askedFollowUps[s.id] || []).length;

            return (
              <Card
                key={s.id}
                onClick={() => setActiveStakeholderId(s.id)}
                className={`cursor-pointer transition-all duration-200 border relative overflow-visible ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/30"
                    : "hover:bg-muted/40"
                }`}
              >
                {askedCount > 0 && (
                  <div className="absolute top-3 right-3 sm:top-2 sm:right-2 z-10">
                    <Badge
                      variant="outline"
                      className="bg-primary text-primary-foreground border-primary/30 text-[10px] font-bold gap-1 px-2 py-0.5 shadow-sm rounded-full"
                    >
                      <CheckCircle2 className="h-3 w-3 text-primary-foreground" /> {askedCount} Asked
                    </Badge>
                  </div>
                )}
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-sm text-foreground leading-tight">{s.name}</h5>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{s.role}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Dialogue Panel */}
      <div className="space-y-4">
        {activeStakeholder && (
          <Card className="border shadow-sm">
            <CardHeader className="bg-muted/30 pb-3 border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{activeStakeholder.name}</CardTitle>
                  <CardDescription className="text-xs">{activeStakeholder.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Initial Statement */}
              <div className="bg-muted/40 p-4 rounded-lg border text-sm leading-relaxed relative">
                <span className="font-bold text-xs uppercase text-primary block mb-1">Statement:</span>
                "{activeStakeholder.initialStatement}"
              </div>

              {/* Revealed Follow-Up Answers */}
              {activeAsked.map((idx) => {
                const item = activeStakeholder.followUps[idx];
                if (!item) return null;

                return (
                  <div key={idx} className="space-y-2 animate-fade-in">
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 text-xs font-semibold text-primary">
                      Q: {item.question}
                    </div>
                    <div className="bg-muted/40 p-3 rounded-lg border text-sm leading-relaxed">
                      "{item.answer}"
                    </div>
                  </div>
                );
              })}

              {/* Follow-Up Options */}
              {activeStakeholder.followUps.length > activeAsked.length && (
                <div className="pt-2 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ask Follow-Up Question:</h5>
                  <div className="space-y-1.5">
                    {activeStakeholder.followUps.map((fu, idx) => {
                      if (activeAsked.includes(idx)) return null;

                      return (
                        <Button
                          key={idx}
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={disabled}
                          onClick={() => onAskFollowUp(activeStakeholder.id, idx)}
                          className="w-full justify-between text-left h-auto py-2 px-3 text-xs font-normal"
                        >
                          <span className="truncate pr-2">"{fu.question}"</span>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Synthesis & Notes Textarea */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Consultation Notes & Synthesis</CardTitle>
            <CardDescription className="text-xs">
              Summarize the key insights from your interviews and state how they influence your plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Write your consultation summary here (2-3 complete sentences)..."
              className="min-h-[100px]"
              disabled={disabled}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
