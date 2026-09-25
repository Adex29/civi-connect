"use client";

import React, { useState, useMemo } from "react";
import { InterventionPlanData, Stakeholder, TimelineRow } from "@/lib/definitions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeCombobox, ComboboxOption } from "@/components/ui/combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  X,
  Info,
  Clock,
  Coins,
  Users,
  Target,
  FileText,
  Boxes,
  CalendarDays,
  ClipboardList,
  AlertCircle,
  Lock,
} from "lucide-react";

export type PlanFieldKey =
  | "projectTitle"
  | "goal"
  | "objectives"
  | "activities"
  | "stakeholders"
  | "resources"
  | "budget"
  | "timeline"
  | "expectedOutcomes";

export interface CommunityActionPlanFormProps {
  plan: InterventionPlanData;
  onChange: (updated: InterventionPlanData) => void;
  disabled?: boolean;
  isMissingErr?: boolean;
  consultedStakeholders?: Stakeholder[];
  scenarioTitle?: string;
  isRevised?: boolean;
  editableFields?: PlanFieldKey[];
}

export function countSentences(text: string): number {
  if (!text) return 0;
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8).length;
}

export function CommunityActionPlanForm({
  plan,
  onChange,
  disabled = false,
  isMissingErr = false,
  consultedStakeholders = [],
  scenarioTitle = "",
  isRevised = false,
  editableFields,
}: CommunityActionPlanFormProps) {
  const isFieldDisabled = (fieldName: PlanFieldKey) => {
    if (disabled) return true;
    if (isRevised && editableFields && editableFields.length > 0) {
      return !editableFields.includes(fieldName);
    }
    return false;
  };

  const isFieldTarget = (fieldName: PlanFieldKey) => {
    return Boolean(isRevised && editableFields && editableFields.includes(fieldName));
  };
  const stakeholderOptions: ComboboxOption[] = useMemo(() => {
    const seen = new Set<string>();
    const opts: ComboboxOption[] = [];
    for (const s of consultedStakeholders) {
      const val = `${s.name} (${s.role})`;
      if (!seen.has(val)) {
        seen.add(val);
        opts.push({
          value: val,
          label: s.name,
          sublabel: s.role,
        });
      }
    }
    return opts;
  }, [consultedStakeholders]);

  const objectivesList =
    plan.objectivesList && plan.objectivesList.length > 0
      ? plan.objectivesList
      : plan.objectives?.trim()
        ? plan.objectives.split("\n").map((s) => s.replace(/^[•\-\*]\s*/, "").trim()).filter(Boolean)
        : [""];

  const stakeholdersList =
    plan.stakeholdersList !== undefined
      ? plan.stakeholdersList
      : plan.stakeholders?.trim()
        ? plan.stakeholders.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

  const resourcesList =
    plan.resourcesList !== undefined
      ? plan.resourcesList
      : plan.resources?.trim()
        ? plan.resources.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

  const timelineRows: TimelineRow[] =
    plan.timelineRows && plan.timelineRows.length > 0
      ? plan.timelineRows
      : [{ phase: "", activity: "", time: "" }];

  const timelineUnit = plan.timelineUnit || "days";

  const expectedOutcomesList =
    plan.expectedOutcomesList && plan.expectedOutcomesList.length > 0
      ? plan.expectedOutcomesList
      : plan.expectedOutcomes?.trim()
        ? plan.expectedOutcomes.split("\n").map((s) => s.replace(/^[•\-\*]\s*/, "").trim()).filter(Boolean)
        : [""];

  // Helper to commit full state changes while keeping legacy flat strings in sync
  const updatePlan = (patch: Partial<InterventionPlanData>) => {
    const next: InterventionPlanData = {
      ...plan,
      ...patch,
    };

    // Auto-sync string representations for backward compatibility
    if (patch.objectivesList !== undefined) {
      next.objectives = patch.objectivesList.filter((o) => o.trim()).join("\n");
    }
    if (patch.stakeholdersList !== undefined) {
      next.stakeholders = patch.stakeholdersList.filter((s) => s.trim()).join(", ");
    }
    if (patch.resourcesList !== undefined) {
      next.resources = patch.resourcesList.filter((r) => r.trim()).join(", ");
    }
    if (patch.timelineRows !== undefined || patch.timelineUnit !== undefined) {
      const rows = patch.timelineRows || timelineRows;
      next.timeline = rows
        .filter((r) => r.phase.trim() || r.activity.trim())
        .map((r) => `${r.phase}: ${r.activity} (${r.time})`)
        .join(" | ");
    }
    if (patch.expectedOutcomesList !== undefined) {
      next.expectedOutcomes = patch.expectedOutcomesList.filter((o) => o.trim()).join("\n");
    }

    onChange(next);
  };

  // --- Objectives Handlers (Max 3) ---
  const handleObjectiveChange = (index: number, val: string) => {
    const updated = [...objectivesList];
    updated[index] = val;
    updatePlan({ objectivesList: updated });
  };

  const handleAddObjective = () => {
    if (objectivesList.length >= 3) return;
    updatePlan({ objectivesList: [...objectivesList, ""] });
  };

  const handleRemoveObjective = (index: number) => {
    if (objectivesList.length <= 1) {
      updatePlan({ objectivesList: [""] });
      return;
    }
    const updated = objectivesList.filter((_, i) => i !== index);
    updatePlan({ objectivesList: updated });
  };

  // --- Timeline Handlers ---
  const handleTimelineRowChange = (index: number, field: keyof TimelineRow, val: string) => {
    const updated = [...timelineRows];
    updated[index] = { ...updated[index], [field]: val };
    updatePlan({ timelineRows: updated });
  };

  const handleAddTimelineRow = () => {
    const newRow: TimelineRow = {
      phase: "",
      activity: "",
      time: "",
    };
    updatePlan({ timelineRows: [...timelineRows, newRow] });
  };

  const handleRemoveTimelineRow = (index: number) => {
    if (timelineRows.length <= 1) return;
    const updated = timelineRows.filter((_, i) => i !== index);
    updatePlan({ timelineRows: updated });
  };

  // --- Expected Outcomes Handlers (Max 3) ---
  const handleExpectedOutcomeChange = (index: number, val: string) => {
    const updated = [...expectedOutcomesList];
    updated[index] = val;
    updatePlan({ expectedOutcomesList: updated });
  };

  const handleAddExpectedOutcome = () => {
    if (expectedOutcomesList.length >= 3) return;
    updatePlan({ expectedOutcomesList: [...expectedOutcomesList, ""] });
  };

  const handleRemoveExpectedOutcome = (index: number) => {
    if (expectedOutcomesList.length <= 1) {
      updatePlan({ expectedOutcomesList: [""] });
      return;
    }
    const updated = expectedOutcomesList.filter((_, i) => i !== index);
    updatePlan({ expectedOutcomesList: updated });
  };

  // Sentences count for Activities description
  const activitySentenceCount = countSentences(plan.activities || "");
  const isSentenceCountOptimal = activitySentenceCount >= 10 && activitySentenceCount <= 15;

  // Completion calculation
  const filledFieldsCount = [
    plan.projectTitle?.trim(),
    plan.goal?.trim(),
    objectivesList.some((o) => o.trim()),
    plan.activities?.trim(),
    stakeholdersList.length > 0,
    resourcesList.length > 0,
    plan.budget?.trim(),
    timelineRows.some((r) => r.activity.trim()),
    expectedOutcomesList.some((o) => o.trim()),
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      {/* Header Matrix Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
        <div>
          <span className="font-bold text-foreground text-xs sm:text-sm flex items-center gap-1.5">
            <ClipboardList className="h-4 w-4 text-primary" />
            {isRevised ? "Adaptive Action Plan Matrix" : "Community Action Plan Matrix"}
          </span>
          <span className="text-[11px] sm:text-xs text-muted-foreground block mt-0.5">
            Complete all action sections. Ground your proposal in local reality, evidence, and community partnerships.
          </span>
        </div>
        <Badge
          variant={filledFieldsCount === 9 ? "default" : "outline"}
          className={`font-mono text-xs shrink-0 self-start sm:self-center px-3 py-1 ${filledFieldsCount === 9
            ? "bg-primary text-primary-foreground font-bold"
            : "border-amber-500/50 text-amber-700 dark:text-amber-300 font-semibold"
            }`}
        >
          {filledFieldsCount} of 9 Completed
        </Badge>
      </div>

      {/* 1. Project Title */}
      <div
        className={`space-y-1.5 p-3 rounded-lg border transition-all ${
          isFieldTarget("projectTitle")
            ? "border-amber-500/60 bg-amber-500/[0.04] ring-1 ring-amber-500/30"
            : isFieldDisabled("projectTitle") && isRevised
            ? "opacity-80 bg-muted/20 border-border/60"
            : "border-transparent"
        }`}
      >
        <Label className="text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-primary" />
            Project Title
          </span>
          <div className="flex items-center gap-2">
            {isFieldTarget("projectTitle") && (
              <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] font-bold gap-1">
                <AlertCircle className="h-3 w-3" /> Affected (Editable)
              </Badge>
            )}
            {isFieldDisabled("projectTitle") && isRevised && (
              <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                <Lock className="h-3 w-3" /> Locked
              </span>
            )}
            <span className="text-destructive font-bold">*</span>
          </div>
        </Label>
        <Input
          value={plan.projectTitle || ""}
          onChange={(e) => updatePlan({ projectTitle: e.target.value })}
          className={isMissingErr && !plan.projectTitle?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
          disabled={isFieldDisabled("projectTitle")}
        />
      </div>

      {/* Main Goal (Textarea) */}
      <div
        className={`space-y-1.5 p-3 rounded-lg border transition-all ${
          isFieldTarget("goal")
            ? "border-amber-500/60 bg-amber-500/[0.04] ring-1 ring-amber-500/30"
            : isFieldDisabled("goal") && isRevised
            ? "opacity-80 bg-muted/20 border-border/60"
            : "border-transparent"
        }`}
      >
        <Label className="text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary" />
            Main Goal
          </span>
          <div className="flex items-center gap-2">
            {isFieldTarget("goal") && (
              <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] font-bold gap-1">
                <AlertCircle className="h-3 w-3" /> Affected (Editable)
              </Badge>
            )}
            {isFieldDisabled("goal") && isRevised && (
              <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                <Lock className="h-3 w-3" /> Locked
              </span>
            )}
            <span className="text-destructive font-bold">*</span>
          </div>
        </Label>
        <Textarea
          value={plan.goal || ""}
          onChange={(e) => updatePlan({ goal: e.target.value })}
          rows={3}
          className={`min-h-[72px] leading-relaxed text-xs sm:text-sm ${
            isMissingErr && !plan.goal?.trim() ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
          disabled={isFieldDisabled("goal")}
        />
      </div>

      {/* 2. Objectives (List, Max 3) */}
      <div
        className={`space-y-2 p-4 rounded-xl border transition-all ${
          isFieldTarget("objectives")
            ? "border-amber-500/60 bg-amber-500/[0.04] ring-1 ring-amber-500/30"
            : isFieldDisabled("objectives") && isRevised
            ? "opacity-80 bg-muted/20 border-border/60"
            : "border-border bg-card"
        }`}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-0 flex-1">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>Objectives (Maximum of 3)</span>
              <span className="text-destructive font-bold">*</span>
            </Label>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Provide 1 to 3 clear, measurable objectives that directly support the main goal.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isFieldTarget("objectives") && (
              <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] font-bold gap-1">
                <AlertCircle className="h-3 w-3" /> Affected (Editable)
              </Badge>
            )}
            {isFieldDisabled("objectives") && isRevised && (
              <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                <Lock className="h-3 w-3" /> Locked
              </span>
            )}
            <Badge variant="secondary" className="font-mono text-[11px]">
              {objectivesList.length} / 3 Max
            </Badge>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {objectivesList.map((obj, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-muted-foreground shrink-0 w-6 text-center">
                #{idx + 1}
              </span>
              <Input
                value={obj}
                onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                className={isMissingErr && !obj.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                disabled={isFieldDisabled("objectives")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => handleRemoveObjective(idx)}
                disabled={isFieldDisabled("objectives") || objectivesList.length <= 1}
                className="h-8 w-8 shrink-0 border border-transparent text-destructive/80 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 hover:shadow-xs transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5"
                title="Remove objective"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {objectivesList.length < 3 && !isFieldDisabled("objectives") && (
          <div className="pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddObjective}
              className="text-xs gap-1.5 h-8 border-dashed"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Objective ({3 - objectivesList.length} remaining)
            </Button>
          </div>
        )}
      </div>

      {/* 3. Activities: Propose One Main Community Action Activity (10-15 Sentences) */}
      <div
        className={`space-y-2.5 p-4 rounded-xl border transition-all ${
          isFieldTarget("activities")
            ? "border-amber-500/60 bg-amber-500/[0.04] ring-1 ring-amber-500/30"
            : isFieldDisabled("activities") && isRevised
            ? "opacity-80 bg-muted/20 border-border/60"
            : "border-border bg-card"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>Main Community Action Activity (10–15 Sentences)</span>
              <span className="text-destructive font-bold">*</span>
            </Label>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Propose one main community action activity that directly addresses the identified issue.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isFieldTarget("activities") && (
              <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] font-bold gap-1">
                <AlertCircle className="h-3 w-3" /> Affected (Editable)
              </Badge>
            )}
            {isFieldDisabled("activities") && isRevised && (
              <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                <Lock className="h-3 w-3" /> Locked
              </span>
            )}
            <Badge
              variant={isSentenceCountOptimal ? "default" : "outline"}
              className={`font-mono text-[11px] ${isSentenceCountOptimal
                ? "bg-emerald-600 text-white font-bold"
                : activitySentenceCount > 0
                  ? "border-amber-500/50 text-amber-700 dark:text-amber-300"
                  : "text-muted-foreground"
                }`}
            >
              {activitySentenceCount} / 10–15 Sentences
            </Badge>
          </div>
        </div>

        <Textarea
          value={plan.activities || ""}
          onChange={(e) => updatePlan({ activities: e.target.value })}
          rows={7}
          className={`min-h-[140px] leading-relaxed text-xs sm:text-sm ${isMissingErr && !plan.activities?.trim() ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          disabled={isFieldDisabled("activities")}
        />
      </div>

      {/* 4. Stakeholders: Multi-badge with Note and Step 4 Quick-Add */}
      <div
        className={`space-y-3 p-4 rounded-xl border transition-all ${
          isFieldTarget("stakeholders")
            ? "border-amber-500/60 bg-amber-500/[0.04] ring-1 ring-amber-500/30"
            : isFieldDisabled("stakeholders") && isRevised
            ? "opacity-80 bg-muted/20 border-border/60"
            : "border-border bg-card"
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>Stakeholders & Key Partners</span>
              <span className="text-destructive font-bold">*</span>
            </Label>
            <div className="flex items-center gap-2">
              {isFieldTarget("stakeholders") && (
                <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] font-bold gap-1">
                  <AlertCircle className="h-3 w-3" /> Affected (Editable)
                </Badge>
              )}
              {isFieldDisabled("stakeholders") && isRevised && (
                <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Include key local leaders, organizations, and at least one consulted stakeholder from your Step 4 interviews.
          </p>
        </div>

        {/* Stakeholder Badges Combobox */}
        <BadgeCombobox
          values={stakeholdersList}
          onValuesChange={(updated) => updatePlan({ stakeholdersList: updated })}
          options={stakeholderOptions}
          disabled={isFieldDisabled("stakeholders")}
          allowCustom={true}
          className={
            isMissingErr && stakeholdersList.length === 0
              ? "border-destructive focus-within:ring-destructive"
              : ""
          }
        />
      </div>

      {/* 5. Resources (Badges) & 6. Budget (Estimated) */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* Resources Badges */}
        <div
          className={`space-y-3 p-4 rounded-xl border transition-all ${
            isFieldTarget("resources")
              ? "border-amber-500/60 bg-amber-500/[0.04] ring-1 ring-amber-500/30"
              : isFieldDisabled("resources") && isRevised
              ? "opacity-80 bg-muted/20 border-border/60"
              : "border-border bg-card"
          }`}
        >
          <div className="space-y-0.5">
            <Label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Boxes className="h-3.5 w-3.5 text-primary" />
                Resources Needed
              </span>
              <div className="flex items-center gap-2">
                {isFieldTarget("resources") && (
                  <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] font-bold gap-1">
                    <AlertCircle className="h-3 w-3" /> Affected (Editable)
                  </Badge>
                )}
                {isFieldDisabled("resources") && isRevised && (
                  <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                )}
                <span className="text-destructive font-bold">*</span>
              </div>
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Equipment, tools, and materials required for the activity.
            </p>
          </div>

          <BadgeCombobox
            values={resourcesList}
            onValuesChange={(updated) => updatePlan({ resourcesList: updated })}
            disabled={isFieldDisabled("resources")}
            allowCustom={true}
            badgeVariant="outline"
            className={
              isMissingErr && resourcesList.length === 0
                ? "border-destructive focus-within:ring-destructive"
                : ""
            }
          />
        </div>

        {/* Budget */}
        <div
          className={`space-y-3 p-4 rounded-xl border transition-all ${
            isFieldTarget("budget")
              ? "border-amber-500/60 bg-amber-500/[0.04] ring-1 ring-amber-500/30"
              : isFieldDisabled("budget") && isRevised
              ? "opacity-80 bg-muted/20 border-border/60"
              : "border-border bg-card"
          }`}
        >
          <div className="space-y-0.5">
            <Label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-primary" />
                Estimated Budget Required
              </span>
              <div className="flex items-center gap-2">
                {isFieldTarget("budget") && (
                  <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] font-bold gap-1">
                    <AlertCircle className="h-3 w-3" /> Affected (Editable)
                  </Badge>
                )}
                {isFieldDisabled("budget") && isRevised && (
                  <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                )}
                <span className="text-destructive font-bold">*</span>
              </div>
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Provide the estimated budget. Consider whether it is reasonable based on the scale of the community problem.
            </p>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground font-bold">
                ₱
              </div>
              <Input
                value={plan.budget || ""}
                onChange={(e) => updatePlan({ budget: e.target.value })}
                className={`pl-8 ${isMissingErr && !plan.budget?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isFieldDisabled("budget")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7. Timeline: Tabular (Phase, Activity, Time) with Days/Weeks Radio */}
      <div
        className={`space-y-3 p-4 rounded-xl border transition-all overflow-hidden ${
          isFieldTarget("timeline")
            ? "border-amber-500/60 bg-amber-500/[0.04] ring-1 ring-amber-500/30"
            : isFieldDisabled("timeline") && isRevised
            ? "opacity-80 bg-muted/20 border-border/60"
            : "border-border bg-card"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Implementation Timeline Table</span>
                <span className="text-destructive font-bold">*</span>
              </Label>
              {isFieldTarget("timeline") && (
                <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] font-bold gap-1">
                  <AlertCircle className="h-3 w-3" /> Affected (Editable)
                </Badge>
              )}
              {isFieldDisabled("timeline") && isRevised && (
                <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Organize your action initiative into clear phases. (Must be completed/implemented within 7 days).
            </p>
          </div>

          {/* Radio Buttons for Time Unit (Days vs Weeks) */}
          <div className="flex items-center gap-2.5 bg-muted/40 px-3 py-1.5 rounded-lg border border-border shrink-0 self-start sm:self-center">
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Time Unit:</span>
            <RadioGroup
              value={timelineUnit}
              onValueChange={(val) => updatePlan({ timelineUnit: val as "days" | "weeks" })}
              className="flex items-center gap-3 sm:gap-4"
              disabled={isFieldDisabled("timeline")}
            >
              <div className="flex items-center space-x-1.5">
                <RadioGroupItem value="days" id="tu-days" />
                <label htmlFor="tu-days" className="text-xs font-medium cursor-pointer">
                  Days
                </label>
              </div>
              <div className="flex items-center space-x-1.5">
                <RadioGroupItem value="weeks" id="tu-weeks" />
                <label htmlFor="tu-weeks" className="text-xs font-medium cursor-pointer">
                  Weeks
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Tabular Table */}
        <div className="border rounded-lg overflow-hidden bg-background">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[28%] text-xs font-bold">Phase</TableHead>
                <TableHead className="text-xs font-bold">Activity / Key Tasks</TableHead>
                <TableHead className="w-[22%] text-xs font-bold">
                  Time ({timelineUnit === "days" ? "Days" : "Weeks"})
                </TableHead>
                {!isFieldDisabled("timeline") && <TableHead className="w-[48px] text-center"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {timelineRows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="p-2 align-top">
                    <Input
                      value={row.phase}
                      onChange={(e) => handleTimelineRowChange(idx, "phase", e.target.value)}
                      className="text-xs h-8"
                      disabled={isFieldDisabled("timeline")}
                    />
                  </TableCell>
                  <TableCell className="p-2 align-top">
                    <Input
                      value={row.activity}
                      onChange={(e) => handleTimelineRowChange(idx, "activity", e.target.value)}
                      className="text-xs h-8"
                      disabled={isFieldDisabled("timeline")}
                    />
                  </TableCell>
                  <TableCell className="p-2 align-top">
                    <Input
                      value={row.time}
                      onChange={(e) => handleTimelineRowChange(idx, "time", e.target.value)}
                      className="text-xs h-8"
                      disabled={isFieldDisabled("timeline")}
                    />
                  </TableCell>
                  {!isFieldDisabled("timeline") && (
                    <TableCell className="p-2 text-center align-top">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveTimelineRow(idx)}
                        disabled={timelineRows.length <= 1}
                        className="h-7 w-7 shrink-0 border border-transparent text-destructive/80 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 hover:shadow-xs transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5 mx-auto"
                        title="Delete phase"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {!isFieldDisabled("timeline") && (
          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTimelineRow}
              className="text-xs gap-1.5 h-8 border-dashed"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Row
            </Button>
          </div>
        )}
      </div>

      {/* 8. Expected Outcomes (List, Max 3, Justifies Objectives) */}
      <div
        className={`space-y-2 p-4 rounded-xl border transition-all ${
          isFieldTarget("expectedOutcomes")
            ? "border-amber-500/60 bg-amber-500/[0.04] ring-1 ring-amber-500/30"
            : isFieldDisabled("expectedOutcomes") && isRevised
            ? "opacity-80 bg-muted/20 border-border/60"
            : "border-border bg-card"
        }`}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-0 flex-1">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>Expected Outcomes (Maximum of 3)</span>
              <span className="text-destructive font-bold">*</span>
            </Label>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              State measurable results. Each outcome should directly justify and correspond to your objectives above.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isFieldTarget("expectedOutcomes") && (
              <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] font-bold gap-1">
                <AlertCircle className="h-3 w-3" /> Affected (Editable)
              </Badge>
            )}
            {isFieldDisabled("expectedOutcomes") && isRevised && (
              <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                <Lock className="h-3 w-3" /> Locked
              </span>
            )}
            <Badge variant="secondary" className="font-mono text-[11px]">
              {expectedOutcomesList.length} / 3 Max
            </Badge>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {expectedOutcomesList.map((outcome, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-muted-foreground shrink-0 w-6 text-center">
                #{idx + 1}
              </span>
              <Input
                value={outcome}
                onChange={(e) => handleExpectedOutcomeChange(idx, e.target.value)}
                className={isMissingErr && !outcome.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                disabled={isFieldDisabled("expectedOutcomes")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => handleRemoveExpectedOutcome(idx)}
                disabled={isFieldDisabled("expectedOutcomes") || expectedOutcomesList.length <= 1}
                className="h-8 w-8 shrink-0 border border-transparent text-destructive/80 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 hover:shadow-xs transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5"
                title="Remove outcome"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {expectedOutcomesList.length < 3 && !isFieldDisabled("expectedOutcomes") && (
          <div className="pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddExpectedOutcome}
              className="text-xs gap-1.5 h-8 border-dashed"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Expected Outcome ({3 - expectedOutcomesList.length} remaining)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
