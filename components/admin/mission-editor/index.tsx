"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MissionDataConfig,
  CauseItem,
  EvidenceItem,
  Stakeholder,
  UnexpectedEvent,
  IssueOption,
} from "@/lib/definitions";
import {
  AlertCircle,
  HelpCircle,
  FileText,
  Users,
  Zap,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

import { IssuesTab } from "./issues-tab";
import { CausesTab } from "./causes-tab";
import { EvidenceTab } from "./evidence-tab";
import { StakeholdersTab } from "./stakeholders-tab";
import { ChallengeTab } from "./challenge-tab";
import { TipsTab } from "./tips-tab";

export interface MissionEditorTabsProps {
  initialConfig?: MissionDataConfig;
  onChange: (config: MissionDataConfig) => void;
}

export function MissionEditorTabs({ initialConfig, onChange }: MissionEditorTabsProps) {
  // Local state for each section - clean and empty by default when adding a new mission
  const [issues, setIssues] = useState<IssueOption[]>(() => {
    const raw = initialConfig?.issues || [];
    if (raw.length === 0) return [];
    const list: IssueOption[] = raw.map((item, idx) => {
      if (typeof item === "string") {
        const isCorrect = initialConfig?.correctIssue
          ? initialConfig.correctIssue.trim().toLowerCase() === item.trim().toLowerCase()
          : idx === 0;
        return {
          id: `issue-${idx}-${Date.now()}`,
          text: item,
          isCorrect,
        };
      }
      return {
        id: item.id || `issue-${idx}-${Date.now()}`,
        text: item.text,
        isCorrect: Boolean(item.isCorrect),
      };
    });

    if (list.length > 0 && !list.some((i) => i.isCorrect)) {
      list[0].isCorrect = true;
    }
    return list;
  });

  const [causes, setCauses] = useState<CauseItem[]>(
    initialConfig?.causes || []
  );

  const [evidence, setEvidence] = useState<EvidenceItem[]>(
    initialConfig?.evidenceLibrary || []
  );

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(
    initialConfig?.stakeholders || []
  );

  const [unexpectedEvent, setUnexpectedEvent] = useState<UnexpectedEvent>(
    initialConfig?.unexpectedEvent || {
      title: "",
      description: "",
      options: [],
    }
  );

  const [stepTips, setStepTips] = useState<Record<number, string>>(
    initialConfig?.stepTips || {}
  );

  type UpdatePayload = Partial<MissionDataConfig> & {
    issues?: IssueOption[];
    evidence?: EvidenceItem[];
  };

  // Sync back to parent whenever local state updates
  const notifyChange = (updated: UpdatePayload) => {
    const nextIssues = updated.issues !== undefined ? updated.issues : issues;
    const cleanedIssues = nextIssues
      .map((item, idx) => ({
        id: item.id || `iss-${idx}`,
        text: item.text.trim(),
        isCorrect: Boolean(item.isCorrect),
      }))
      .filter((item) => item.text.length > 0);

    if (cleanedIssues.length > 0 && !cleanedIssues.some((i) => i.isCorrect)) {
      cleanedIssues[0].isCorrect = true;
    }

    const correctIssue = cleanedIssues.find((i) => i.isCorrect)?.text || "";

    const nextCauses = updated.causes !== undefined ? updated.causes : causes;
    const nextEvidence = updated.evidence !== undefined
      ? updated.evidence
      : (updated.evidenceLibrary !== undefined ? updated.evidenceLibrary : evidence);
    const nextStakeholders = updated.stakeholders !== undefined ? updated.stakeholders : stakeholders;
    const nextUnexpectedEvent = updated.unexpectedEvent !== undefined ? updated.unexpectedEvent : unexpectedEvent;
    const nextStepTips = updated.stepTips !== undefined ? updated.stepTips : stepTips;

    // Filter out any completely empty tips
    const cleanedTips: Record<number, string> = {};
    for (const [key, val] of Object.entries(nextStepTips)) {
      if (val && val.trim().length > 0) {
        cleanedTips[Number(key)] = val.trim();
      }
    }

    const config: MissionDataConfig = {
      issues: cleanedIssues,
      correctIssue,
      causes: nextCauses,
      evidenceLibrary: nextEvidence,
      stakeholders: nextStakeholders,
      unexpectedEvent: nextUnexpectedEvent,
      stepTips: cleanedTips,
    };
    onChange(config);
  };

  const parsedIssuesCount = issues.filter((i) => i.text.trim().length > 0).length;

  const activeTipsCount = Object.values(stepTips).filter(
    (t) => t && t.trim().length > 0
  ).length;

  const stepsNav = [
    {
      value: "issues",
      stepNum: "1",
      title: "Priority Issues",
      icon: AlertCircle,
      count: `${parsedIssuesCount} items`,
      hasData: parsedIssuesCount > 0,
    },
    {
      value: "causes",
      stepNum: "2",
      title: "Root Causes",
      icon: HelpCircle,
      count: `${causes.length} factors`,
      hasData: causes.length > 0,
    },
    {
      value: "evidence",
      stepNum: "3",
      title: "Evidence Library",
      icon: FileText,
      count: `${evidence.length} sources`,
      hasData: evidence.length > 0,
    },
    {
      value: "stakeholders",
      stepNum: "4",
      title: "Stakeholders",
      icon: Users,
      count: `${stakeholders.length} figures`,
      hasData: stakeholders.length > 0,
    },
    {
      value: "challenge",
      stepNum: "6",
      title: "Challenge Event",
      icon: Zap,
      count: `${unexpectedEvent.options?.length || 0} choices`,
      hasData: Boolean(unexpectedEvent.title?.trim()) || (unexpectedEvent.options?.length || 0) > 0,
    },
    {
      value: "tips",
      stepNum: "Tips",
      title: "Step Guidance",
      icon: Lightbulb,
      count: `${activeTipsCount} tips`,
      hasData: activeTipsCount > 0,
    },
  ];

  return (
    <Tabs defaultValue="issues" orientation="vertical" className="w-full block">
      <div className="w-full grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] gap-6 items-start">
        {/* Sticky Vertical Sidebar Navigation */}
        <aside className="surface-panel z-10 space-y-1 rounded-xl p-2.5 lg:sticky lg:top-20">
          <div className="px-3 py-2 border-b border-border mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Mission Steps Navigation
            </span>
          </div>

          <TabsList variant="line" className="w-full flex flex-col items-stretch gap-1 h-auto p-0 bg-transparent">
            {stepsNav.map((step) => {
              return (
                <TabsTrigger
                  key={step.value}
                  value={step.value}
                  className="w-full justify-start gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs font-semibold transition-all border border-transparent group/trigger data-active:border-surface-border data-active:bg-card data-active:text-primary data-active:shadow-xs hover:border-surface-border/60 hover:bg-card/50 hover:text-primary border-b-0 data-active:border-b-0"
                >
                  <span className="flex items-center justify-center h-6 w-6 rounded-md bg-muted text-[11px] font-bold group-data-active/trigger:bg-primary group-data-active/trigger:text-primary-foreground group-data-active/trigger:shadow-2xs shrink-0 transition-colors">
                    {step.stepNum}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate font-semibold text-xs">{step.title}</span>
                      {step.hasData && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{step.count}</p>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </aside>

        {/* Content Area - Maximizes 100% of remaining right column */}
        <main className="w-full min-w-0">
          <IssuesTab
            issues={issues}
            onChange={(nextIssues) => {
              setIssues(nextIssues);
              notifyChange({ issues: nextIssues });
            }}
          />

          <CausesTab
            causes={causes}
            onChange={(nextCauses) => {
              setCauses(nextCauses);
              notifyChange({ causes: nextCauses });
            }}
          />

          <EvidenceTab
            evidence={evidence}
            onChange={(nextEvidence) => {
              setEvidence(nextEvidence);
              notifyChange({ evidence: nextEvidence });
            }}
          />

          <StakeholdersTab
            stakeholders={stakeholders}
            onChange={(nextStakeholders) => {
              setStakeholders(nextStakeholders);
              notifyChange({ stakeholders: nextStakeholders });
            }}
          />

          <ChallengeTab
            unexpectedEvent={unexpectedEvent}
            onChange={(nextEvent) => {
              setUnexpectedEvent(nextEvent);
              notifyChange({ unexpectedEvent: nextEvent });
            }}
          />

          <TipsTab
            stepTips={stepTips}
            onChange={(nextTips) => {
              setStepTips(nextTips);
              notifyChange({ stepTips: nextTips });
            }}
          />
        </main>
      </div>
    </Tabs>
  );
}
