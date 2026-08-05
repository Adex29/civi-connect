"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MissionDataConfig,
  CauseItem,
  EvidenceItem,
  Stakeholder,
  UnexpectedEvent,
} from "@/lib/definitions";

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

  return (
    <Tabs defaultValue="issues" className="flex flex-col space-y-4 w-full">
      <TabsList className="w-full flex justify-start overflow-x-auto scrollbar-none h-auto p-1">
        <TabsTrigger value="issues" className="text-xs">Step 1: Issues</TabsTrigger>
        <TabsTrigger value="causes" className="text-xs">Step 2: Causes</TabsTrigger>
        <TabsTrigger value="evidence" className="text-xs">Step 3: Evidence</TabsTrigger>
        <TabsTrigger value="stakeholders" className="text-xs">Step 4: Stakeholders</TabsTrigger>
        <TabsTrigger value="challenge" className="text-xs">Step 6: Challenge</TabsTrigger>
        <TabsTrigger value="tips" className="text-xs">Step Tips</TabsTrigger>
      </TabsList>

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
    </Tabs>
  );
}
