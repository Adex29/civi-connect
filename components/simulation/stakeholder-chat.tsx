"use client";

import React, { useState } from "react";
import { User, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Stakeholder } from "@/lib/definitions";

export interface StakeholderChatProps {
  stakeholders: Stakeholder[];
  selectedStakeholderIds?: string[];
  onToggleStakeholderSelect?: (id: string) => void;
  notes?: string;
  onNotesChange?: (notes: string) => void;
  askedFollowUps?: Record<string, number[]>;
  onAskFollowUp?: (stakeholderId: string, followUpIndex: number) => void;
  disabled?: boolean;
}

export function StakeholderChat({
  stakeholders,
  selectedStakeholderIds = [],
  onToggleStakeholderSelect,
  disabled,
}: StakeholderChatProps) {
  const [clickedIds, setClickedIds] = useState<string[]>(() => {
    return [...(selectedStakeholderIds || [])];
  });
  const [activeStakeholderId, setActiveStakeholderId] = useState<string>("");

  const handleCardClick = (id: string) => {
    setActiveStakeholderId(id);
    setClickedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const activeStakeholder = stakeholders.find((s) => s.id === activeStakeholderId);

  return (
    <div className="space-y-6">
      {/* Top Section: Stakeholder Selector Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Community Stakeholders
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stakeholders.map((s) => {
            const isActive = s.id === activeStakeholderId;
            const isClicked = clickedIds.includes(s.id);
            const isSelected = selectedStakeholderIds.includes(s.id);

            return (
              <Card
                key={s.id}
                onClick={() => handleCardClick(s.id)}
                className={`cursor-pointer transition-all duration-200 border relative overflow-visible ${
                  isActive
                    ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/30"
                    : "hover:bg-muted/40"
                }`}
              >
                <CardContent className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-sm text-foreground leading-snug break-words">{s.name}</h5>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-normal break-words">{s.role}</p>
                    </div>
                  </div>

                  {/* Selection Checkbox - Disabled if student has not clicked the stakeholder */}
                  <div
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      id={`chk-${s.id}`}
                      checked={isSelected}
                      disabled={!isClicked || disabled}
                      onCheckedChange={() => {
                        if (isClicked && !disabled) {
                          onToggleStakeholderSelect?.(s.id);
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Dialogue Panel: Statement Only */}
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
            {/* Statement */}
            <div className="bg-muted/40 p-4 rounded-lg border text-sm leading-relaxed relative">
              <span className="font-bold text-xs uppercase text-primary block mb-1">Statement:</span>
              &quot;{activeStakeholder.initialStatement}&quot;
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`active-chk-${activeStakeholder.id}`}
                checked={selectedStakeholderIds.includes(activeStakeholder.id)}
                disabled={disabled}
                onCheckedChange={() => onToggleStakeholderSelect?.(activeStakeholder.id)}
              />
              <label
                htmlFor={`active-chk-${activeStakeholder.id}`}
                className="text-xs font-semibold cursor-pointer select-none"
              >
                Select this stakeholder
              </label>
            </div>
            {selectedStakeholderIds.includes(activeStakeholder.id) && (
              <Badge variant="outline" className="text-[10px] font-medium border-primary/40 text-primary bg-primary/10">
                <CheckCircle2 className="h-3 w-3 mr-1 text-primary" /> Selected
              </Badge>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
