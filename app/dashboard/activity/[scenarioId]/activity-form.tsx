"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  Award,
  Archive,
  ShieldAlert,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileEdit,
  History,
  Scale,
  Target,
  GitBranch,
  FileSearch,
  Users,
  ClipboardList,
} from "lucide-react";
import { Scenario, Submission, SimulationStateData, CauseItem, EvidenceItem, AIEvaluationResult, SIMULATION_PASSING_THRESHOLD, InterventionPlanData, ChallengeEvent, CIVIC_REFLECTION_QUESTIONS } from "@/lib/definitions";
import { getMissionDataForScenario, getScenarioChallenges } from "@/lib/mission-data";
import { formatFlagLabel, isAiControlFlag } from "@/lib/flag-utils";
import { StepTracker } from "@/components/simulation/step-tracker";
import { CauseRanker } from "@/components/simulation/cause-ranker";
import { EvidenceLibrary, EvaluatedEvidence } from "@/components/simulation/evidence-library";
import { StakeholderChat } from "@/components/simulation/stakeholder-chat";
import { CommunityActionPlanForm } from "@/components/simulation/community-action-plan-form";
import { PerformanceReport } from "@/components/simulation/performance-report";
import { MissionBriefing } from "@/components/simulation/mission-briefing";
import { processSimulationStepAction, submitReflectionAction } from "./actions";

const STEP_TITLES: Record<number, string> = {
  1: "Identify Community Issues",
  2: "Analyze Causes",
  3: "Evaluate Digital Evidence",
  4: "Consult Simulated Stakeholders",
  5: "Community Action Planning",
  6: "Challenge Simulation",
  7: "Plan Revision",
};

const STEP_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Target,
  2: GitBranch,
  3: FileSearch,
  4: Users,
  5: ClipboardList,
  6: AlertTriangle,
  7: RotateCcw,
};

export function ActivityForm({
  scenario,
  studentName = "Student",
  existingSubmission,
  isArchived = false,
}: {
  scenario: Scenario;
  studentName?: string;
  existingSubmission?: Submission | null;
  isArchived?: boolean;
}) {
  const router = useRouter();
  const missionData = getMissionDataForScenario(scenario);

  const isReadOnly = isArchived || existingSubmission?.status === "completed";

  // Initialize state from existing submission or start at step 1
  const initialState: SimulationStateData = existingSubmission?.simulationState || {
    currentStep: 1,
  };

  const [showBriefing, setShowBriefing] = useState(true);
  const [step, setStep] = useState<number>(() => {
    if (existingSubmission?.status === "completed") return 10;
    return initialState.currentStep || 1;
  });
  const CurrentStepIcon = STEP_ICONS[step] || Sparkles;
  const [simState, setSimState] = useState<SimulationStateData>(initialState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
    evaluation?: AIEvaluationResult;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // --- Step 1 State ---
  const [selectedIssue, setSelectedIssue] = useState<string>(
    simState.step1?.selectedIssue || ""
  );
  const [step1Justification, setStep1Justification] = useState<string>(
    simState.step1?.justification || ""
  );
  // Randomized issues order for the student side (stable across renders)
  const [shuffledIssues] = useState<string[]>(() => {
    const list = [...missionData.issues];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  });
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationModalData, setEvaluationModalData] = useState<{
    success: boolean;
    message: string;
    nextStep?: number;
    evaluation?: AIEvaluationResult;
  } | null>(null);

  // --- Step 2 State ---
  const [shuffledStep2Causes] = useState<CauseItem[]>(() => {
    // If student already has a saved ranking in simState, restore their saved order
    if (simState.step2?.orderedCauseIds && simState.step2.orderedCauseIds.length > 0) {
      const causeMap = new Map((missionData.causes || []).map((c) => [c.id, c]));
      const restored = simState.step2.orderedCauseIds
        .map((id) => causeMap.get(id))
        .filter((c): c is CauseItem => Boolean(c));
      const missing = (missionData.causes || []).filter(
        (c) => !simState.step2?.orderedCauseIds?.includes(c.id)
      );
      return [...restored, ...missing];
    }

    // For initial attempts, randomize the order so students must discover the hierarchy
    const list = [...(missionData.causes || [])];
    if (list.length > 1) {
      // Fisher-Yates shuffle
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
      // Ensure the initial randomized list is not accidentally identical to the correct order
      const isIdentical = list.every((item, idx) => item.id === missionData.causes[idx]?.id);
      if (isIdentical && list.length >= 2) {
        [list[0], list[1]] = [list[1], list[0]];
      }
    }
    return list;
  });

  const [orderedCauseIds, setOrderedCauseIds] = useState<string[]>(() =>
    simState.step2?.orderedCauseIds && simState.step2.orderedCauseIds.length > 0
      ? simState.step2.orderedCauseIds
      : shuffledStep2Causes.map((c) => c.id)
  );

  // --- Step 3 State ---
  const [evaluatedEvidences, setEvaluatedEvidences] = useState<EvaluatedEvidence[]>(
    simState.step3?.evaluatedEvidences || []
  );

  // --- Step 4 State ---
  const [consultedIds, setConsultedIds] = useState<string[]>(
    simState.step4?.consultedStakeholderIds || []
  );
  const [interviewNotes, setInterviewNotes] = useState<string>(
    simState.step4?.interviewNotes || ""
  );
  const [askedFollowUps, setAskedFollowUps] = useState<Record<string, number[]>>(
    simState.step4?.askedFollowUps || {}
  );

  // Helper to initialize plan data with list structures and fallbacks
  const initPlanData = (saved?: InterventionPlanData): InterventionPlanData => {
    const objectivesList = saved?.objectivesList?.length
      ? saved.objectivesList
      : saved?.objectives?.trim()
      ? saved.objectives.split("\n").map((s) => s.replace(/^[•\-\*]\s*/, "").trim()).filter(Boolean)
      : [""];

    const stakeholdersList = saved?.stakeholdersList !== undefined
      ? saved.stakeholdersList
      : saved?.stakeholders?.trim()
      ? saved.stakeholders.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const resourcesList = saved?.resourcesList !== undefined
      ? saved.resourcesList
      : saved?.resources?.trim()
      ? saved.resources.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const timelineRows = saved?.timelineRows?.length
      ? saved.timelineRows
      : [{ phase: "", activity: "", time: "" }];

    const expectedOutcomesList = saved?.expectedOutcomesList?.length
      ? saved.expectedOutcomesList
      : saved?.expectedOutcomes?.trim()
      ? saved.expectedOutcomes.split("\n").map((s) => s.replace(/^[•\-\*]\s*/, "").trim()).filter(Boolean)
      : [""];

    return {
      projectTitle: saved?.projectTitle || "",
      goal: saved?.goal || "",
      objectives: saved?.objectives || objectivesList.filter(Boolean).join("\n"),
      activities: saved?.activities || "",
      stakeholders: saved?.stakeholders || stakeholdersList.join(", "),
      resources: saved?.resources || resourcesList.join(", "),
      budget: saved?.budget || "",
      timeline: saved?.timeline || timelineRows.map((r) => `${r.phase}: ${r.activity} (${r.time})`).join(" | "),
      expectedOutcomes: saved?.expectedOutcomes || expectedOutcomesList.filter(Boolean).join("\n"),
      objectivesList: objectivesList.length > 0 ? objectivesList.slice(0, 3) : [""],
      stakeholdersList,
      resourcesList,
      timelineRows,
      timelineUnit: saved?.timelineUnit || "days",
      expectedOutcomesList: expectedOutcomesList.length > 0 ? expectedOutcomesList.slice(0, 3) : [""],
    };
  };

  // --- Step 5 State (Community Action Plan) ---
  const [planData, setPlanData] = useState<InterventionPlanData>(() =>
    initPlanData(simState.step5?.plan)
  );

  // --- Step 6 State (Challenge Simulation - Randomized Crisis) ---
  const scenarioChallenges = missionData.challenges || getScenarioChallenges(scenario);
  const [step6Challenge] = useState<ChallengeEvent>(() => {
    if (simState.step6?.challenge) {
      return simState.step6.challenge;
    }
    const randomIndex = Math.floor(Math.random() * scenarioChallenges.length);
    return scenarioChallenges[randomIndex] || scenarioChallenges[0];
  });

  // --- Step 7 State (Adaptive Plan Revision - Prefilled from Step 5) ---
  const [revisedPlanData, setRevisedPlanData] = useState<InterventionPlanData>(() =>
    initPlanData(simState.step7?.revisedPlan || simState.step5?.plan)
  );

  // Synchronize revisedPlanData from step 5 when entering step 7 if it was not previously saved
  React.useEffect(() => {
    if (step === 7 && !simState.step7?.revisedPlan) {
      setRevisedPlanData((prev) => ({
        ...planData,
        ...prev,
        projectTitle: prev.projectTitle || planData.projectTitle,
        goal: prev.goal || planData.goal,
        objectives: prev.objectives || planData.objectives,
        activities: prev.activities || planData.activities,
        stakeholders: prev.stakeholders || planData.stakeholders,
        resources: prev.resources || planData.resources,
        budget: prev.budget || planData.budget,
        timeline: prev.timeline || planData.timeline,
        expectedOutcomes: prev.expectedOutcomes || planData.expectedOutcomes,
        objectivesList: prev.objectivesList?.length ? prev.objectivesList : planData.objectivesList,
        stakeholdersList: prev.stakeholdersList?.length ? prev.stakeholdersList : planData.stakeholdersList,
        resourcesList: prev.resourcesList?.length ? prev.resourcesList : planData.resourcesList,
        timelineRows: prev.timelineRows?.length ? prev.timelineRows : planData.timelineRows,
        timelineUnit: prev.timelineUnit || planData.timelineUnit || "days",
        expectedOutcomesList: prev.expectedOutcomesList?.length ? prev.expectedOutcomesList : planData.expectedOutcomesList,
      }));
    }
  }, [step, planData, simState.step7?.revisedPlan]);

  // --- Final Reflection State (Step 8: Civic Action Reflection & Evaluation) ---
  const [reflectionQuestion] = useState<string>(() => {
    if (simState.reflection?.question) return simState.reflection.question;
    // Derive a stable pseudo-random assignment per student across the 5 questions
    const seed = existingSubmission?.id || existingSubmission?.studentId || scenario.id || "civi";
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return CIVIC_REFLECTION_QUESTIONS[hash % CIVIC_REFLECTION_QUESTIONS.length];
  });

  const [reflectionAnswer, setReflectionAnswer] = useState<string>(
    simState.reflection?.answer || ""
  );

  const reflectionSentences = reflectionAnswer
    .split(/(?<=[.?!])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
  const reflectionSentenceCount = reflectionSentences.length;

  const handleAskFollowUp = (stakeholderId: string, followUpIndex: number) => {
    const updated = { ...askedFollowUps };
    const current = updated[stakeholderId] || [];
    if (!current.includes(followUpIndex)) {
      updated[stakeholderId] = [...current, followUpIndex];
      setAskedFollowUps(updated);
    }
    if (!consultedIds.includes(stakeholderId)) {
      setConsultedIds([...consultedIds, stakeholderId]);
    }
  };

  // Generic Step Handler
  const handleNextStep = async () => {
    if (isReadOnly) {
      if (step < 7) {
        setStep(step + 1);
      } else if (step === 7) {
        if (simState.scores) {
          setStep(8);
        } else {
          setFormError("This mission was archived before Step 7 was completed. Simulation scorecard is unavailable.");
        }
      }
      return;
    }

    setLoading(true);
    setFormError(null);
    setFeedback(null);

    let payload: any = {};

    if (step === 1) {
      if (!selectedIssue || !selectedIssue.trim()) {
        setLoading(false);
        setFormError("Please select a priority community concern before proceeding.");
        return;
      }
      payload = { selectedIssue, justification: step1Justification };
    } else if (step === 2) {
      payload = { orderedCauseIds };
    } else if (step === 3) {
      const totalRequired = missionData.evidenceLibrary?.length || 0;
      if (evaluatedEvidences.length < totalRequired) {
        setLoading(false);
        setFormError(
          `You need to evaluate all ${totalRequired} evidence sources before proceeding. Currently, you have evaluated ${evaluatedEvidences.length} of ${totalRequired}. Please inspect and evaluate all the evidence.`
        );
        return;
      }
      payload = { evaluatedEvidences };
    } else if (step === 4) {
      if (!consultedIds || consultedIds.length === 0) {
        setLoading(false);
        setFormError("Please select at least one stakeholder before continuing your mission.");
        return;
      }
      payload = { consultedIds };
    } else if (step === 5) {
      const missing: string[] = [];
      if (!planData.projectTitle?.trim()) missing.push("Project Title");
      if (!planData.goal?.trim()) missing.push("Goal");
      const validObjectives = (planData.objectivesList || []).filter((o) => o.trim());
      if (validObjectives.length === 0 && !planData.objectives?.trim()) missing.push("Objectives");
      if (!planData.activities?.trim()) missing.push("Activities");
      const validStakeholders = (planData.stakeholdersList || []).filter((s) => s.trim());
      if (validStakeholders.length === 0 && !planData.stakeholders?.trim()) missing.push("Stakeholders");
      const validResources = (planData.resourcesList || []).filter((r) => r.trim());
      if (validResources.length === 0 && !planData.resources?.trim()) missing.push("Resources");
      if (!planData.budget?.trim()) missing.push("Budget");
      if (!planData.timeline?.trim()) missing.push("Timeline");
      const validOutcomes = (planData.expectedOutcomesList || []).filter((o) => o.trim());
      if (validOutcomes.length === 0 && !planData.expectedOutcomes?.trim()) missing.push("Expected Outcomes");

      if (missing.length > 0) {
        setLoading(false);
        setFormError(
          `Please complete all fields of your community action plan. Missing: ${missing.join(", ")}.`
        );
        return;
      }
      payload = { plan: planData, consultedStakeholderIds: consultedIds };
    } else if (step === 6) {
      payload = { challenge: step6Challenge };
      const res = await processSimulationStepAction(scenario.id, 6, payload);
      setLoading(false);

      if ("error" in res && res.error) {
        setFormError(res.error);
        return;
      }

      setSimState((prev) => ({
        ...prev,
        currentStep: Math.max(prev.currentStep, 7),
        step6: {
          challenge: step6Challenge,
          feedback: res.feedback || "Challenge acknowledged. Proceeding to Plan Revision.",
          passed: true,
          evaluation: res.evaluation,
        },
      }));

      // Directly redirect to Step 7 (Plan Revision) without showing evaluation modal
      setStep(7);
      return;
    } else if (step === 7) {
      const completePlan: InterventionPlanData = {
        ...planData,
        ...revisedPlanData,
      };

      const target = step6Challenge.affectedField;
      if (target === "stakeholders") {
        const validList = (completePlan.stakeholdersList || []).filter((s) => s.trim());
        if (validList.length === 0 && !completePlan.stakeholders?.trim()) {
          setLoading(false);
          setFormError("Please update the Stakeholders field to adapt to the stakeholder challenge.");
          return;
        }
      } else if (target === "budget") {
        if (!completePlan.budget?.trim()) {
          setLoading(false);
          setFormError("Please revise the Budget field to adapt to the budget challenge.");
          return;
        }
      } else if (target === "resources") {
        const validList = (completePlan.resourcesList || []).filter((r) => r.trim());
        if (validList.length === 0 && !completePlan.resources?.trim()) {
          setLoading(false);
          setFormError("Please update the Resources field to adapt to the resource challenge.");
          return;
        }
      }

      payload = { revisedPlan: completePlan };
    }

    const res = await processSimulationStepAction(scenario.id, step, payload);
    setLoading(false);

    if ("error" in res && res.error) {
      setFormError(res.error);
      return;
    }

    if (res.scores) {
      setSimState((prev) => ({ ...prev, scores: res.scores }));
    }

    const isSuccess = !!res.success;
    const feedbackMsg = res.feedback || (isSuccess ? "Step validated successfully." : "Please revise your response.");

    setEvaluationModalData({
      success: isSuccess,
      message: feedbackMsg,
      nextStep: res.nextStep,
      evaluation: res.evaluation,
    });
    setShowEvaluationModal(true);
  };

  const handleContinueMissionFromModal = () => {
    if (!evaluationModalData?.success) return;
    const score = evaluationModalData.evaluation?.step_score;
    if (score !== undefined && score < SIMULATION_PASSING_THRESHOLD) return;
    const nextStepNumber = evaluationModalData.nextStep || (step + 1);
    setShowEvaluationModal(false);
    setFormError(null);
    setFeedback(null);
    setStep(nextStepNumber);
  };

  const handleFinalReflectionSubmit = async () => {
    if (isReadOnly) {
      if (existingSubmission?.status === "completed") {
        setStep(10);
      } else {
        setFormError("This mission was archived before completion. The completion certificate is only issued for finished missions.");
      }
      return;
    }

    if (reflectionSentenceCount < 5) {
      setFeedback({
        success: false,
        message: `Your reflection must be between 5 and 15 complete sentences (Currently: ${reflectionSentenceCount} sentence${reflectionSentenceCount === 1 ? "" : "s"}). Please expand on your ethical reasoning and civic insights.`,
      });
      return;
    }

    if (reflectionSentenceCount > 15) {
      setFeedback({
        success: false,
        message: `Your reflection exceeds the maximum allowed length of 15 sentences (Currently: ${reflectionSentenceCount} sentences). Please make your response more concise.`,
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const res = await submitReflectionAction(scenario.id, reflectionAnswer, reflectionQuestion);
    setLoading(false);

    if (res.success) {
      setStep(10); // 10 = Completion screen
    } else {
      setFeedback({
        success: false,
        message: res.feedback || "Please revise your reflection answer.",
        evaluation: res.evaluation,
      });
    }
  };

  const maxStepReached = Math.max(step, simState.currentStep || 1);
  const completedSteps = Array.from({ length: Math.min(maxStepReached - 1, 7) }, (_, i) => i + 1);

  // --- Mission Briefing Screen (Shown first upon opening scenario) ---
  if (showBriefing) {
    return (
      <MissionBriefing
        scenario={scenario}
        studentName={studentName}
        currentStep={step}
        isCompleted={existingSubmission?.status === "completed"}
        isArchived={isArchived}
        onStart={() => setShowBriefing(false)}
      />
    );
  }

  // --- Performance Report View (Step 8 / 9) ---
  if (step === 8 || step === 9) {
    if (simState.scores) {
      return (
        <div className="max-w-4xl mx-auto space-y-8">
          <PerformanceReport
            scores={simState.scores}
            studentName={studentName}
            onContinueToReflection={() => {
              setStep(8.5); // 8.5 = Final Reflection Form
            }}
            onBack={() => setStep(7)}
          />
        </div>
      );
    }
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center animate-fade-in-up">
        <Card className="border p-8 space-y-4">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold">Performance Report Unavailable</h2>
          <p className="text-sm text-muted-foreground">
            This mission was archived before all simulation steps were evaluated.
          </p>
          <Button onClick={() => setStep(7)} variant="outline">
            Back to Step 07
          </Button>
        </Card>
      </div>
    );
  }

  // --- Final Reflection View (Step 8.5 / 9.5) ---
  if (step === 8.5 || step === 9.5) {
    const isCountValid = reflectionSentenceCount >= 5 && reflectionSentenceCount <= 15;
    const isCountTooShort = reflectionSentenceCount < 5;

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
        <Card className="border shadow-md">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /> Step 08: Civic Action Reflection
              </CardTitle>
              <Badge variant="outline" className="text-xs font-mono font-semibold">
                Post-Simulation Evaluation
              </Badge>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Reflect deeply on your civic inquiry experience, decision-making flexibility, and community action sustainability.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            {/* Assigned Reflection Question Prompt */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="h-3.5 w-3.5" /> Assigned Reflection Prompt
                </span>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                  5–15 Sentences Required
                </Badge>
              </div>
              <p className="text-sm font-semibold text-foreground leading-snug">
                {reflectionQuestion}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-foreground">
                  Your Reflection Response:
                </label>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono font-bold transition-colors ${
                      isCountValid
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : isCountTooShort
                        ? "border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                        : "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    }`}
                  >
                    {isCountValid && <CheckCircle2 className="h-3 w-3 mr-1 inline" />}
                    {reflectionSentenceCount} / 5–15 Sentences
                  </Badge>
                </div>
              </div>

              <Textarea
                value={reflectionAnswer}
                onChange={(e) => setReflectionAnswer(e.target.value)}
                placeholder="Write your civic reflection here (explain your reasoning, evidence analysis, and community insights in 5–15 complete sentences)..."
                className="min-h-[160px] leading-relaxed"
                disabled={isReadOnly}
              />
              <p className="text-[11px] text-muted-foreground italic">
                Note: A thorough civic reflection requires 5 to 15 complete sentences explaining your perspectives, ethical reasoning, and lessons learned.
              </p>
            </div>

            {feedback && (
              <Alert
                className={`animate-fade-in-up border ${
                  feedback.success
                    ? "bg-primary/5 border-primary/30 text-foreground"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200"
                }`}
              >
                <div className="flex items-start gap-3 w-full">
                  <Sparkles
                    className={`h-5 w-5 shrink-0 mt-0.5 ${
                      feedback.success ? "text-primary" : "text-rose-600"
                    }`}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <AlertTitle className="font-bold text-xs flex items-center gap-1.5 mb-0">
                        {feedback.success ? "AI Verification: Reflection Validated!" : "AI Verification: Revision Required"}
                      </AlertTitle>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {feedback.evaluation?.step_score !== undefined && (
                          <Badge variant={feedback.success ? "default" : "destructive"} className="text-[10px] font-mono font-bold">
                            Score: {feedback.evaluation.step_score}%
                          </Badge>
                        )}
                        {feedback.evaluation?.flags
                          ?.filter((flag) => !isAiControlFlag(flag) || !feedback.evaluation?.is_ai_generated)
                          .map((flag) => (
                            <Badge key={flag} variant="outline" className="text-[10px] font-medium border-rose-500/40 text-rose-700 dark:text-rose-300">
                              {formatFlagLabel(flag)}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <AlertDescription className="text-xs leading-relaxed">
                      "{feedback.message}"
                    </AlertDescription>

                    {feedback.evaluation?.is_ai_generated && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs font-semibold">
                        <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                        <span>AI-Generated Content Flagged: Please rewrite using your own authentic voice.</span>
                      </div>
                    )}

                    {feedback.evaluation?.strengths && feedback.evaluation.strengths.length > 0 && (
                      <div className="pt-1.5 border-t border-border/40 text-[11px] space-y-1">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block">Strengths:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {feedback.evaluation.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feedback.evaluation?.areas_for_improvement && feedback.evaluation.areas_for_improvement.length > 0 && (
                      <div className="pt-1 text-[11px] space-y-1">
                        <span className="font-bold text-amber-700 dark:text-amber-400 block">Areas for Improvement:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {feedback.evaluation.areas_for_improvement.map((imp, idx) => (
                            <li key={idx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="bg-muted/20 border-t p-4 flex justify-between gap-4">
            <Button variant="outline" onClick={() => setStep(8)} disabled={loading}>
              Back to Scorecard
            </Button>
            <Button
              onClick={handleFinalReflectionSubmit}
              disabled={loading || (!isReadOnly && reflectionSentenceCount < 5) || (isReadOnly && existingSubmission?.status !== "completed")}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isReadOnly
                ? existingSubmission?.status === "completed"
                  ? "View Certificate"
                  : "Mission Incomplete"
                : "Submit Reflection & Complete Mission"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // --- Step 10: Completion Certificate View ---
  if (step === 10) {
    if (existingSubmission?.status !== "completed") {
      return (
        <div className="max-w-3xl mx-auto space-y-8 text-center animate-fade-in-up">
          <Card className="border-2 border-amber-500/30 shadow-xl bg-card p-8 space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-amber-600" />
            </div>
            <div className="space-y-2">
              <h1 className="page-title text-3xl">Mission Incomplete</h1>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
                This mission was archived or unassigned before all steps and final reflections were completed. A completion certificate was not issued.
              </p>
            </div>
            <div className="flex justify-center pt-2">
              <Button onClick={() => router.push("/dashboard")} className="gap-2">
                Return to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-8 text-center animate-fade-in-up">
        <Card className="border-2 border-primary/20 shadow-xl bg-card p-8 space-y-6">
          <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Award className="h-12 w-12 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <h1 className="page-title text-3xl">Congratulations, {studentName}!</h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
              You have successfully completed the <strong>Civi-Tech Civic Engagement Simulation</strong> for{" "}
              <em>"{scenario.title}"</em>.
            </p>
          </div>

          <div className="p-6 bg-muted/40 rounded-xl border text-left text-sm leading-relaxed space-y-3">
            <p>
              Your journey through this simulation has demonstrated your ability to analyze community issues, evaluate evidence, consider different perspectives, and develop thoughtful, evidence-based solutions.
            </p>
            <p className="font-semibold text-primary">
              Every responsible decision contributes to building stronger, more resilient, and more inclusive communities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button onClick={() => setStep(8)} variant="outline" className="gap-2">
              <Trophy className="h-4 w-4" /> View Performance Report
            </Button>
            <Button onClick={() => router.push("/dashboard")} className="gap-2">
              Return to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // --- Main 7-Step Interactive Simulation Layout (Left Panel + Main Panel + Right Panel) ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel: Mission Progress & Scenario Context */}
      <div className="lg:col-span-3 space-y-6">
        <StepTracker
          currentStep={step}
          scenario={scenario}
          completedSteps={completedSteps}
          onSelectStep={(s) => setStep(s)}
        />
      </div>

      {/* Main Panel & Right Panel Container */}
      <div className="lg:col-span-9 space-y-6">
        {isReadOnly && (
          <Alert className="bg-slate-500/10 border-slate-500/20 animate-fade-in-up">
            <Archive className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
            <AlertTitle className="font-bold text-xs text-slate-900 dark:text-slate-200">
              Read-Only Mode
            </AlertTitle>
            <AlertDescription className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isArchived
                ? "This mission or classroom is archived. You are viewing this mission in read-only mode and cannot submit or modify answers."
                : "You have completed this mission. You can browse your submitted answers and AI feedback in read-only mode."}
            </AlertDescription>
          </Alert>
        )}

        {/* Step Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-primary/5 p-3 sm:p-4 rounded-xl border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 shadow-2xs">
              <CurrentStepIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                Mission Step 0{step} of 07
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">
                {STEP_TITLES[step] || "Civic Simulation Step"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowBriefing(true)}
              className="text-xs gap-1.5 h-7 border-primary/30 hover:bg-primary/10"
            >
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Mission Overview
            </Button>
            <span className="w-fit shrink-0 rounded-md bg-primary px-3 py-1 font-mono text-xs font-bold text-primary-foreground">
              {isReadOnly ? 100 : step <= 1 ? 0 : Math.min(Math.round(((step - 1) / 7) * 100), 95)}% Complete
            </span>
          </div>
        </div>

        {/* Mission Context & Legal Guidance (Mobile/Tablet View - Placed directly under header) */}
        <div className="xl:hidden">
          <Card className="border border-primary/30 bg-primary/5 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                <Scale className="h-4 w-4 shrink-0" /> Mission Context
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-foreground/90 leading-relaxed space-y-2">
              <h4 className="font-bold text-sm text-foreground">{scenario.title}</h4>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{scenario.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Main Interactive Screen */}
          <div className="xl:col-span-8 space-y-6">
            <Card className="border shadow-sm">
              <CardHeader className="border-b bg-muted/20 pb-4">
                <CardTitle className="text-base font-bold">
                  {step === 1 && "What is the main issue that needs to be addressed first?"}
                  {step === 2 && "Arrange the causes (Most Significant → Least Significant)"}
                  {step === 3 && "Evidence Library Inspection"}
                  {step === 4 && "Select the stakeholders you believe can provide the most useful information or assistance in developing your initiative"}
                  {step === 5 && "Community Action Planning"}
                  {step === 6 && missionData.unexpectedEvent.title}
                  {step === 7 && "Adaptive Plan Revision (Post-Challenge)"}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* STEP 1: Identify Community Issues */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block">
                        What is the main issue that needs to be addressed first?
                      </label>
                      <div className="space-y-2">
                        {shuffledIssues.map((issue, idx) => (
                          <div
                            key={idx}
                            onClick={() => !isReadOnly && setSelectedIssue(issue)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                              isReadOnly ? "cursor-default opacity-85" : "cursor-pointer hover:bg-muted/50"
                            } ${
                              selectedIssue === issue
                                ? "bg-primary/10 border-primary text-primary font-semibold"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                  selectedIssue === issue ? "border-primary bg-primary text-primary-foreground" : ""
                                }`}
                              >
                                {selectedIssue === issue && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                              </div>
                              <span>{issue}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold block">
                        Justify your answer in 2-3 complete sentences:
                      </label>
                      <Textarea
                        value={step1Justification}
                        onChange={(e) => setStep1Justification(e.target.value)}
                        placeholder="Explain why this issue is the most urgent concern for the barangay..."
                        className="min-h-[100px]"
                        disabled={isReadOnly || loading}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Analyze Causes */}
                {step === 2 && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Use the arrows to re-order the causes from top (Most Significant) to bottom (Least Significant).
                    </p>
                    <CauseRanker
                      key={shuffledStep2Causes.map((c) => c.id).join("-")}
                      initialCauses={shuffledStep2Causes}
                      onOrderChange={(ids) => setOrderedCauseIds(ids)}
                      disabled={isReadOnly}
                    />
                  </div>
                )}

                {/* STEP 3: Evaluate Digital Evidence */}
                {step === 3 && (
                  <EvidenceLibrary
                    items={missionData.evidenceLibrary}
                    evaluated={evaluatedEvidences}
                    onUpdateEvaluated={(evs) => setEvaluatedEvidences(evs)}
                    disabled={isReadOnly}
                  />
                )}

                {/* STEP 4: Consult Simulated Stakeholders */}
                {step === 4 && (
                  <StakeholderChat
                    stakeholders={missionData.stakeholders}
                    selectedStakeholderIds={consultedIds}
                    onToggleStakeholderSelect={(id) => {
                      setConsultedIds((prev) =>
                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                      );
                    }}
                    disabled={isReadOnly}
                  />
                )}

                {/* STEP 5: Community Action Planning */}
                {step === 5 && (
                  <CommunityActionPlanForm
                    plan={planData}
                    onChange={(updated) => setPlanData(updated)}
                    disabled={isReadOnly || loading}
                    isMissingErr={Boolean(formError)}
                    consultedStakeholders={missionData.stakeholders.filter((s) => consultedIds.includes(s.id))}
                    scenarioTitle={scenario.title}
                  />
                )}

                {/* STEP 6: Challenge Simulation */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div className="p-5 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          Unexpected Simulation Challenge
                        </span>
                        <Badge className="bg-amber-600 text-white font-mono uppercase text-[11px] tracking-wider">
                          {step6Challenge.categoryLabel.replace(/^[A-Z]\.\s*/i, "")}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-amber-950 dark:text-amber-100">
                          {step6Challenge.title}
                        </h3>
                        <p className="text-sm font-medium text-amber-900/90 dark:text-amber-200/90 mt-1 leading-relaxed">
                          {step6Challenge.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-amber-500/20 text-xs text-amber-900/80 dark:text-amber-200/80 space-y-1">
                        <p className="font-semibold text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                          <span>Affected Action Plan Component:</span>
                          <Badge variant="outline" className="text-[10px] font-mono border-amber-600/40 text-amber-800 dark:text-amber-300 uppercase">
                            {step6Challenge.affectedField}
                          </Badge>
                        </p>
                        <p className="text-muted-foreground mt-0.5">
                          This unexpected crisis directly impacts the <strong>{step6Challenge.affectedField}</strong> section of your initial plan.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/40 rounded-xl border border-border text-xs leading-relaxed space-y-2">
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        Adaptive Planning Instructions:
                      </h4>
                      <p className="text-muted-foreground">
                        Click <strong className="text-foreground">"Revise Initial Plan"</strong> below to proceed to the Plan Revision stage. In that stage, only the <strong className="text-foreground uppercase">{step6Challenge.affectedField}</strong> component will be unlocked for editing so you can resolve this crisis while all other sections remain locked.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 7: Revise Intervention Plan (Adaptive Revision after Step 6) */}
                {step === 7 && (() => {
                  const filledCount = [
                    revisedPlanData.projectTitle,
                    revisedPlanData.goal,
                    revisedPlanData.objectives,
                    revisedPlanData.activities,
                    revisedPlanData.stakeholders,
                    revisedPlanData.resources,
                    revisedPlanData.budget,
                    revisedPlanData.timeline,
                    revisedPlanData.expectedOutcomes,
                  ].filter((v) => v?.trim().length > 0).length;

                  return (
                    <div className="space-y-5">
                      {/* Challenge Context Banner */}
                      <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            Active Challenge from Step 6: {step6Challenge.title}
                          </span>
                          <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-800 dark:text-amber-300 uppercase">
                            {step6Challenge.categoryLabel.replace(/^[A-Z]\.\s*/i, "")}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-amber-950 dark:text-amber-100">
                          {step6Challenge.description}
                        </p>
                        <div className="pt-2 border-t border-amber-500/20 text-xs text-amber-900/90 dark:text-amber-200/90 flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">Target Section to Revise:</span>
                          <Badge className="bg-amber-600 text-white font-mono uppercase text-[10px]">
                            {step6Challenge.affectedField}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">(All other sections are locked)</span>
                        </div>
                      </div>

                      {/* Header Tracker with Reset Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                        <div>
                          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <FileEdit className="h-4 w-4 text-primary" />
                            <span>Adaptive Action Plan Matrix</span>
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Update your <span className="font-semibold text-foreground uppercase">{step6Challenge.affectedField}</span> to accommodate the challenge.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const target = step6Challenge.affectedField;
                              setRevisedPlanData((prev) => ({
                                ...prev,
                                [target]: planData[target],
                                ...(target === "stakeholders" ? { stakeholdersList: planData.stakeholdersList } : {}),
                                ...(target === "resources" ? { resourcesList: planData.resourcesList } : {}),
                              }));
                            }}
                            disabled={isReadOnly || loading}
                            className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground gap-1"
                            title="Reset the affected section back to your Step 5 original plan"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Reset Section</span>
                          </Button>
                          <Badge
                            variant={filledCount === 9 ? "default" : "secondary"}
                            className={`text-xs font-mono font-bold px-2.5 py-0.5 ${
                              filledCount === 9
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {filledCount} of 9 Completed
                          </Badge>
                        </div>
                      </div>

                      {/* Adaptive Community Action Plan Form */}
                      <CommunityActionPlanForm
                        plan={revisedPlanData}
                        onChange={(updated) => setRevisedPlanData(updated)}
                        disabled={isReadOnly || loading}
                        isMissingErr={Boolean(formError && formError.toLowerCase().includes("missing"))}
                        consultedStakeholders={missionData.stakeholders.filter((s) => consultedIds.includes(s.id))}
                        scenarioTitle={scenario.title}
                        isRevised={true}
                        editableFields={step6Challenge.editableFields}
                      />
                    </div>
                  );
                })()}

                {/* Client Validation / Submission Error */}
                {formError && (
                  <Alert variant="destructive" className="animate-fade-in-up">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <AlertDescription className="text-xs">{formError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>

              <CardFooter className="bg-muted/20 border-t p-3 sm:p-4 flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-4">
                {step > 1 ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormError(null);
                      setStep(step - 1);
                    }}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  onClick={handleNextStep}
                  disabled={loading || (isReadOnly && step === 7 && !simState.scores)}
                  className="gap-2 font-bold px-6 w-full sm:w-auto"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isReadOnly
                    ? step === 7
                      ? simState.scores
                        ? "View Scorecard"
                        : "Simulation Incomplete"
                      : "Next Step"
                    : step === 4
                    ? "Continue Mission"
                    : step === 5
                    ? "Submit Initial Plan"
                    : step === 6
                    ? "Revise Initial Plan"
                    : "Submit Response"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Panel: Mission Tips & Mission Context */}
          <div className="xl:col-span-4 space-y-4">
            <Card className="border border-amber-500/20 bg-amber-500/5 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Lightbulb className="h-4 w-4 shrink-0" /> Step 0{step} Mission Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed space-y-2">
                <p>{missionData.stepTips[step] || "Read carefully and ground your plan in authentic evidence."}</p>
                <div className="pt-2 border-t border-amber-500/20 text-[11px] italic">
                  Tip: Senior High School Civic Engagement standards emphasize evidence, sustainability, and community consultation.
                </div>
              </CardContent>
            </Card>

            {/* Mission Context & Legal Guidance (Desktop View) */}
            <Card className="hidden xl:block border border-primary/30 bg-primary/5 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                  <Scale className="h-4 w-4 shrink-0" /> Mission Context
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-foreground/90 leading-relaxed space-y-2">
                <h4 className="font-bold text-sm text-foreground">{scenario.title}</h4>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{scenario.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Evaluation Response Modal */}
      <Dialog open={showEvaluationModal} onOpenChange={setShowEvaluationModal}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <CurrentStepIcon className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  AI Evaluation Response
                </DialogTitle>
                <DialogDescription className="text-xs flex items-center gap-1.5 mt-0.5">
                  <span className="font-semibold text-primary">Step 0{step}:</span>
                  <span>{STEP_TITLES[step] || "Step Evaluation"}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Status Banner */}
            {evaluationModalData?.success && (evaluationModalData.evaluation?.step_score === undefined || evaluationModalData.evaluation.step_score >= SIMULATION_PASSING_THRESHOLD) ? (
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Step Validated!</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      Passing threshold met (≥{SIMULATION_PASSING_THRESHOLD}%). You can now continue your mission.
                    </p>
                  </div>
                </div>
                {evaluationModalData?.evaluation?.step_score !== undefined && (
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-mono text-xs px-2.5 py-1">
                      Score: {evaluationModalData.evaluation.step_score}%
                    </Badge>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      Threshold: ≥{SIMULATION_PASSING_THRESHOLD}%
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Revision Required</p>
                    <p className="text-xs text-rose-700 dark:text-rose-300">
                      {evaluationModalData?.evaluation?.step_score !== undefined && evaluationModalData.evaluation.step_score < SIMULATION_PASSING_THRESHOLD
                        ? `A score of ${SIMULATION_PASSING_THRESHOLD}% or higher is required to advance (Current Score: ${evaluationModalData.evaluation.step_score}%).`
                        : "Please review the feedback below and revise your response."}
                    </p>
                  </div>
                </div>
                {evaluationModalData?.evaluation?.step_score !== undefined && (
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <Badge variant="destructive" className="font-mono text-xs px-2.5 py-1">
                      Score: {evaluationModalData.evaluation.step_score}%
                    </Badge>
                    <span className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold">
                      Required: ≥{SIMULATION_PASSING_THRESHOLD}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* AI-Generated Content Alert */}
            {evaluationModalData?.evaluation?.is_ai_generated && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs font-semibold">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                <span>AI-Generated Content Flagged: Please rewrite using your own authentic voice.</span>
              </div>
            )}

            {/* Flags */}
            {evaluationModalData?.evaluation?.flags && evaluationModalData.evaluation.flags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {evaluationModalData.evaluation.flags
                  .filter((flag) => !isAiControlFlag(flag) || !evaluationModalData.evaluation?.is_ai_generated)
                  .map((flag) => (
                    <Badge key={flag} variant="outline" className="text-[11px] font-medium border-rose-500/40 text-rose-700 dark:text-rose-300">
                      {formatFlagLabel(flag)}
                    </Badge>
                  ))}
              </div>
            )}

            {/* Evaluator Feedback */}
            <div className="space-y-1.5 bg-muted/40 p-3.5 rounded-lg border text-xs leading-relaxed">
              <span className="font-semibold text-foreground block">Evaluator Feedback:</span>
              <p className="text-muted-foreground whitespace-pre-wrap">
                "{evaluationModalData?.message}"
              </p>
            </div>

            {/* Strengths */}
            {evaluationModalData?.evaluation?.strengths && evaluationModalData.evaluation.strengths.length > 0 && (
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-xs space-y-1.5">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Strengths:
                </span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                  {evaluationModalData.evaluation.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {evaluationModalData?.evaluation?.areas_for_improvement && evaluationModalData.evaluation.areas_for_improvement.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 text-xs space-y-1.5">
                <span className="font-bold text-amber-700 dark:text-amber-400 block flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5" /> Areas for Improvement:
                </span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                  {evaluationModalData.evaluation.areas_for_improvement.map((imp, idx) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEvaluationModal(false)}
              className="w-full sm:w-auto gap-1.5"
            >
              <FileEdit className="h-4 w-4" />
              Revise
            </Button>

            <Button
              type="button"
              onClick={handleContinueMissionFromModal}
              disabled={
                !evaluationModalData?.success ||
                (evaluationModalData?.evaluation?.step_score !== undefined &&
                  evaluationModalData.evaluation.step_score < SIMULATION_PASSING_THRESHOLD)
              }
              className="w-full sm:w-auto gap-1.5 font-bold"
            >
              Continue Mission
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
