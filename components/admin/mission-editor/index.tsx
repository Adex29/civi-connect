"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MissionDataConfig,
  CauseItem,
  EvidenceItem,
  Stakeholder,
  UnexpectedEvent,
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
  // Local state for each section
  const [issuesText, setIssuesText] = useState<string>(
    (initialConfig?.issues || [
      "Improper Waste Disposal",
      "Lack of Community Participation",
      "Weak Policy Enforcement",
      "Limited Resource Allocation",
    ]).join("\n")
  );

  const [causes, setCauses] = useState<CauseItem[]>(
    initialConfig?.causes || [
      { id: "c1", title: "Weak Regulatory Enforcement", description: "Local tanods rarely issue citations." },
      { id: "c2", title: "Resource & Budget Constraints", description: "Insufficient funds for frequent collection." },
    ]
  );

  const [evidence, setEvidence] = useState<EvidenceItem[]>(
    initialConfig?.evidenceLibrary || [
      {
        id: "ev1",
        title: "Official Barangay Environmental Report",
        type: "Government Report",
        snippet: "Evaluation showing 45% compliance with waste segregation.",
        fullText: "Municipal audit confirms urgent intervention needed in low-lying sitios.",
        defaultCredibility: 5,
        supports: ["cause", "need"],
      },
    ]
  );

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(
    initialConfig?.stakeholders || [
      {
        id: "st1",
        name: "Hon. Manuel Cruz",
        role: "Barangay Chairman",
        initialStatement: "We are taking steps to address this issue, but need active community support.",
        followUps: [
          { question: "How can students help?", answer: "Students can lead sitio awareness and eco-brick collection drives." },
        ],
      },
    ]
  );

  const [unexpectedEvent, setUnexpectedEvent] = useState<UnexpectedEvent>(
    initialConfig?.unexpectedEvent || {
      title: "Unexpected Challenge: Subsidies Reduced by 25%",
      description: "Emergency calamity reallocation has reduced the initial budget allocation.",
      options: [
        { id: "opt1", text: "Halt operations until funds return.", isOptimal: false, feedback: "Halting operations causes project failure." },
        { id: "opt2", text: "Mobilize local youth volunteers and junk shop recycling revenue.", isOptimal: true, feedback: "Great adaptive decision!" },
      ],
    }
  );

  const [stepTips, setStepTips] = useState<Record<number, string>>(
    initialConfig?.stepTips || {
      1: "Differentiate symptoms from root issues before prioritizing.",
      2: "Analyze trigger cause relationships.",
      3: "Combine official reports with community evidence.",
      4: "Interview both grassroots residents and officials.",
      5: "Ensure the intervention plan is actionable and budgeted.",
      6: "Adapt to unexpected challenges while preserving core goals.",
      7: "Assess ethical impacts and who benefits.",
    }
  );

  type UpdatePayload = Partial<MissionDataConfig> & {
    issuesRawText?: string;
    evidence?: EvidenceItem[];
  };

  // Sync back to parent whenever local state updates
  const notifyChange = (updated: UpdatePayload) => {
    const rawText = updated.issuesRawText !== undefined ? updated.issuesRawText : issuesText;
    const issues = rawText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const config: MissionDataConfig = {
      issues,
      causes: updated.causes || causes,
      evidenceLibrary: updated.evidence || updated.evidenceLibrary || evidence,
      stakeholders: updated.stakeholders || stakeholders,
      unexpectedEvent: updated.unexpectedEvent || unexpectedEvent,
      stepTips: updated.stepTips || stepTips,
    };
    onChange(config);
  };

  const parsedIssuesCount = issuesText
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0).length;

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
      hasData: Boolean(unexpectedEvent.title),
    },
    {
      value: "tips",
      stepNum: "Tips",
      title: "Step Guidance",
      icon: Lightbulb,
      count: `${Object.keys(stepTips).length} tips`,
      hasData: Object.keys(stepTips).length > 0,
    },
  ];

  return (
    <Tabs defaultValue="issues" orientation="vertical" className="w-full block">
      <div className="w-full grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] gap-6 items-start">
        {/* Sticky Vertical Sidebar Navigation */}
        <aside className="lg:sticky lg:top-20 z-10 bg-card border border-border rounded-xl p-2.5 shadow-sm space-y-1">
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
                  className="w-full justify-start gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-all group/trigger data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20 hover:bg-muted/60"
                >
                  <span className="flex items-center justify-center h-6 w-6 rounded-md bg-muted text-[11px] font-bold group-data-[state=active]/trigger:bg-primary group-data-[state=active]/trigger:text-primary-foreground shrink-0 transition-colors">
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
            issuesText={issuesText}
            onChange={(val) => {
              setIssuesText(val);
              notifyChange({ issuesRawText: val });
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
