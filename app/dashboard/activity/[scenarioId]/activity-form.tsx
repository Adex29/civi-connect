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
} from "lucide-react";
import { Scenario, Submission, SimulationStateData, EvidenceItem, AIEvaluationResult } from "@/lib/definitions";
import { getMissionDataForScenario } from "@/lib/mission-data";
import { StepTracker } from "@/components/simulation/step-tracker";
import { CauseRanker } from "@/components/simulation/cause-ranker";
import { EvidenceLibrary, EvaluatedEvidence } from "@/components/simulation/evidence-library";
import { StakeholderChat } from "@/components/simulation/stakeholder-chat";
import { PerformanceReport } from "@/components/simulation/performance-report";
import { MissionBriefing } from "@/components/simulation/mission-briefing";
import { processSimulationStepAction, submitReflectionAction } from "./actions";

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
  const [simState, setSimState] = useState<SimulationStateData>(initialState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
    evaluation?: AIEvaluationResult;
  } | null>(null);

  // --- Step 1 State ---
  const [selectedIssue, setSelectedIssue] = useState<string>(
    simState.step1?.selectedIssue || missionData.issues[0]
  );
  const [step1Justification, setStep1Justification] = useState<string>(
    simState.step1?.justification || ""
  );
  const [showStep1RevisionPrompt, setShowStep1RevisionPrompt] = useState(false);

  // --- Step 2 State ---
  const [orderedCauseIds, setOrderedCauseIds] = useState<string[]>(
    simState.step2?.orderedCauseIds || missionData.causes.map((c) => c.id)
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

  // --- Step 5 State (Original Intervention Plan) ---
  const [planData, setPlanData] = useState({
    projectTitle: simState.step5?.plan?.projectTitle || `Community Action Plan: ${scenario.title}`,
    goal: simState.step5?.plan?.goal || "",
    objectives: simState.step5?.plan?.objectives || "",
    activities: simState.step5?.plan?.activities || "",
    stakeholders: simState.step5?.plan?.stakeholders || "",
    resources: simState.step5?.plan?.resources || "",
    budget: simState.step5?.plan?.budget || "",
    timeline: simState.step5?.plan?.timeline || "",
    expectedOutcomes: simState.step5?.plan?.expectedOutcomes || "",
  });

  // --- Step 6 State (Challenge Simulation) ---
  const [selectedChallengeOptId, setSelectedChallengeOptId] = useState<string>(
    simState.step6?.selectedOptionId || missionData.unexpectedEvent.options[0]?.id || ""
  );
  const [step6Justification, setStep6Justification] = useState<string>(
    simState.step6?.justification || ""
  );

  // --- Step 7 State (Adaptive Plan Revision - Prefilled from Step 5) ---
  const [revisedPlanData, setRevisedPlanData] = useState({
    projectTitle: simState.step7?.revisedPlan?.projectTitle || simState.step5?.plan?.projectTitle || `Community Action Plan: ${scenario.title}`,
    goal: simState.step7?.revisedPlan?.goal || simState.step5?.plan?.goal || "",
    objectives: simState.step7?.revisedPlan?.objectives || simState.step5?.plan?.objectives || "",
    activities: simState.step7?.revisedPlan?.activities || simState.step5?.plan?.activities || "",
    stakeholders: simState.step7?.revisedPlan?.stakeholders || simState.step5?.plan?.stakeholders || "",
    resources: simState.step7?.revisedPlan?.resources || simState.step5?.plan?.resources || "",
    budget: simState.step7?.revisedPlan?.budget || simState.step5?.plan?.budget || "",
    timeline: simState.step7?.revisedPlan?.timeline || simState.step5?.plan?.timeline || "",
    expectedOutcomes: simState.step7?.revisedPlan?.expectedOutcomes || simState.step5?.plan?.expectedOutcomes || "",
  });
  const [showOriginalPlanRef, setShowOriginalPlanRef] = useState(false);

  // Synchronize revisedPlanData from step 5 when entering step 7 if it was not previously saved
  React.useEffect(() => {
    if (step === 7 && !simState.step7?.revisedPlan) {
      setRevisedPlanData((prev) => ({
        projectTitle: prev.projectTitle || planData.projectTitle,
        goal: prev.goal || planData.goal,
        objectives: prev.objectives || planData.objectives,
        activities: prev.activities || planData.activities,
        stakeholders: prev.stakeholders || planData.stakeholders,
        resources: prev.resources || planData.resources,
        budget: prev.budget || planData.budget,
        timeline: prev.timeline || planData.timeline,
        expectedOutcomes: prev.expectedOutcomes || planData.expectedOutcomes,
      }));
    }
  }, [step, planData, simState.step7?.revisedPlan]);

  // --- Step 8 State (Community Impact Assessment) ---
  const [impactData, setImpactData] = useState({
    shortTermImpact: simState.step8?.impact?.shortTermImpact || "",
    longTermImpact: simState.step8?.impact?.longTermImpact || "",
    possibleRisks: simState.step8?.impact?.possibleRisks || "",
    whoBenefits: simState.step8?.impact?.whoBenefits || "",
    whoMightBeAffected: simState.step8?.impact?.whoMightBeAffected || "",
  });

  // --- Final Reflection State ---
  const [reflectionAnswer, setReflectionAnswer] = useState<string>(
    simState.reflection?.answer || ""
  );

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
      if (step < 8) {
        setStep(step + 1);
      } else if (step === 8) {
        setStep(9);
      }
      return;
    }

    setLoading(true);
    setFeedback(null);

    let payload: any = {};

    if (step === 1) {
      payload = { selectedIssue, justification: step1Justification };
    } else if (step === 2) {
      payload = { orderedCauseIds };
    } else if (step === 3) {
      if (evaluatedEvidences.length < 2) {
        setLoading(false);
        setFeedback({
          success: false,
          message: "Please evaluate and rate at least 2 pieces of evidence before proceeding.",
        });
        return;
      }
      payload = { evaluatedEvidences };
    } else if (step === 4) {
      payload = { consultedIds, notes: interviewNotes, askedFollowUps };
    } else if (step === 5) {
      payload = { plan: planData };
    } else if (step === 6) {
      const opt = missionData.unexpectedEvent.options.find((o) => o.id === selectedChallengeOptId);
      payload = {
        selectedOptionId: selectedChallengeOptId,
        selectedOptionText: opt?.text || "",
        justification: step6Justification,
      };
    } else if (step === 7) {
      const missing: string[] = [];
      if (!revisedPlanData.projectTitle?.trim()) missing.push("Project Title");
      if (!revisedPlanData.goal?.trim()) missing.push("Goal");
      if (!revisedPlanData.objectives?.trim()) missing.push("Objectives");
      if (!revisedPlanData.activities?.trim()) missing.push("Activities");
      if (!revisedPlanData.stakeholders?.trim()) missing.push("Stakeholders & Roles");
      if (!revisedPlanData.resources?.trim()) missing.push("Resources Needed");
      if (!revisedPlanData.budget?.trim()) missing.push("Budget Allocation");
      if (!revisedPlanData.timeline?.trim()) missing.push("Timeline");
      if (!revisedPlanData.expectedOutcomes?.trim()) missing.push("Expected Outcomes");

      if (missing.length > 0) {
        setLoading(false);
        setFeedback({
          success: false,
          message: `Please complete all 9 fields of your revised intervention plan. Missing: ${missing.join(", ")}.`,
        });
        return;
      }
      payload = { revisedPlan: revisedPlanData };
    } else if (step === 8) {
      payload = { impact: impactData };
    }

    const res = await processSimulationStepAction(scenario.id, step, payload);
    setLoading(false);

    if (res.success) {
      setFeedback({ success: true, message: res.feedback, evaluation: res.evaluation });

      if (res.scores) {
        setSimState((prev) => ({ ...prev, scores: res.scores }));
      }

      if (step === 1 && !showStep1RevisionPrompt) {
        setShowStep1RevisionPrompt(true);
        return;
      }

      if (res.nextStep) {
        setStep(res.nextStep);
      }
    } else {
      setFeedback({
        success: false,
        message: res.feedback || "Please revise your response.",
        evaluation: res.evaluation,
      });
    }
  };

  const handleFinalReflectionSubmit = async () => {
    if (isReadOnly) {
      setStep(10);
      return;
    }

    setLoading(true);
    setFeedback(null);

    const res = await submitReflectionAction(scenario.id, reflectionAnswer);
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
  const completedSteps = Array.from({ length: Math.min(maxStepReached - 1, 8) }, (_, i) => i + 1);

  // --- Mission Briefing Screen (Shown first upon opening scenario) ---
  if (showBriefing) {
    return (
      <MissionBriefing
        scenario={scenario}
        studentName={studentName}
        currentStep={step}
        isCompleted={existingSubmission?.status === "completed"}
        onStart={() => setShowBriefing(false)}
      />
    );
  }

  // --- Step 9: Performance Report View ---
  if (step === 9 && simState.scores) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <PerformanceReport
          scores={simState.scores}
          studentName={studentName}
          onContinueToReflection={() => {
            setStep(9.5); // 9.5 = Final Reflection Form
          }}
          onBack={() => setStep(8)}
        />
      </div>
    );
  }

  // --- Step 9.5: Final Reflection View ---
  if (step === 9.5) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
        <Card className="border shadow-md">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" /> Final Reflection
            </CardTitle>
            <CardDescription className="text-sm">
              Reflect deeply on your civic decision-making process.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold block leading-snug">
                If this issue occurred in your own community, would you implement the same solution? Why or why not?
              </label>
              <Textarea
                value={reflectionAnswer}
                onChange={(e) => setReflectionAnswer(e.target.value)}
                placeholder="Write your final reflection here (explain your ethical reasoning and community insights)..."
                className="min-h-[140px]"
                disabled={isReadOnly}
              />
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
                        {feedback.evaluation?.flags?.map((flag) => (
                          <Badge key={flag} variant="outline" className="text-[10px] font-mono border-rose-500/40 text-rose-700 dark:text-rose-300">
                            {flag}
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
                        <span>AI-Generated Content Flagged: Please rewrite using your own authentic student voice.</span>
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
            <Button variant="outline" onClick={() => setStep(9)} disabled={loading}>
              Back to Scorecard
            </Button>
            <Button onClick={handleFinalReflectionSubmit} disabled={loading || (!isReadOnly && !reflectionAnswer.trim())}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isReadOnly ? "View Certificate" : "Submit Reflection & Complete Mission"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // --- Step 10: Completion Certificate View ---
  if (step === 10) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 text-center animate-fade-in-up">
        <Card className="border-2 border-primary/20 shadow-xl bg-card p-8 space-y-6">
          <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Award className="h-12 w-12 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Congratulations, {studentName}!</h1>
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
            <Button onClick={() => setStep(9)} variant="outline" className="gap-2">
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
                ? "This classroom is archived. You are viewing this mission in read-only mode and cannot submit or modify answers."
                : "You have completed this mission. You can browse your submitted answers and AI feedback in read-only mode."}
            </AlertDescription>
          </Alert>
        )}

        {/* Step Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-primary/5 p-3 sm:p-4 rounded-xl border border-primary/20">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Mission Step 0{step} of 08
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">
              {step === 1 && "Identify Community Issues"}
              {step === 2 && "Analyze Causes"}
              {step === 3 && "Evaluate Digital Evidence"}
              {step === 4 && "Consult Simulated Stakeholders"}
              {step === 5 && "Develop an Intervention Plan"}
              {step === 6 && "Anticipate Challenges (Simulation)"}
              {step === 7 && "Revise Intervention Plan (Adaptive Revision)"}
              {step === 8 && "Assess Community Impact"}
            </h2>
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
            <span className="text-xs font-bold font-mono px-3 py-1 bg-primary text-primary-foreground rounded-full shrink-0 w-fit">
              {isReadOnly ? 100 : step <= 1 ? 0 : Math.min(Math.round(((step - 1) / 8) * 100), 95)}% Complete
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Main Interactive Screen */}
          <div className="xl:col-span-8 space-y-6">
            <Card className="border shadow-sm">
              <CardHeader className="border-b bg-muted/20 pb-4">
                <CardTitle className="text-base font-bold">
                  {step === 1 && "Which community issue should be prioritized?"}
                  {step === 2 && "Arrange the causes (Most Significant → Least Significant)"}
                  {step === 3 && "Evidence Library Inspection"}
                  {step === 4 && "Stakeholder Consultation"}
                  {step === 5 && "Intervention Plan Builder"}
                  {step === 6 && missionData.unexpectedEvent.title}
                  {step === 7 && "Adaptive Plan Revision (Post-Challenge)"}
                  {step === 8 && "Community Impact Assessment"}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* STEP 1: Identify Community Issues */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block">Select the priority concern:</label>
                      <div className="space-y-2">
                        {missionData.issues.map((issue, idx) => (
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

                    {showStep1RevisionPrompt && (
                      <Alert className="bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200">
                        <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                        <AlertTitle className="font-bold text-xs text-amber-800 dark:text-amber-300">
                          AI Insights & Revision Guidance
                        </AlertTitle>
                        <AlertDescription className="text-xs space-y-3 mt-1.5">
                          <p>
                            You identified <strong>"{selectedIssue}"</strong>. Consider whether this issue is the primary concern or one contributing factor. Would you like to revise?
                          </p>
                          <div className="flex gap-3 pt-1">
                            <Button size="xs" variant="outline" onClick={() => setShowStep1RevisionPrompt(false)}>
                              [YES] Revise Choice
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => {
                                setStep(2);
                                setShowStep1RevisionPrompt(false);
                              }}
                            >
                              [NO] Keep & Proceed <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* STEP 2: Analyze Causes */}
                {step === 2 && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Use the arrows to re-order the causes from top (Most Significant) to bottom (Least Significant).
                    </p>
                    <CauseRanker
                      initialCauses={missionData.causes}
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
                    notes={interviewNotes}
                    onNotesChange={(n) => setInterviewNotes(n)}
                    askedFollowUps={askedFollowUps}
                    onAskFollowUp={handleAskFollowUp}
                    disabled={isReadOnly}
                  />
                )}

                {/* STEP 5: Develop an Intervention Plan */}
                {step === 5 && (() => {
                  const filledCount = [
                    planData.projectTitle,
                    planData.goal,
                    planData.objectives,
                    planData.activities,
                    planData.stakeholders,
                    planData.resources,
                    planData.budget,
                    planData.timeline,
                    planData.expectedOutcomes,
                  ].filter((f) => f && f.trim().length > 0).length;
                  const isMissingErr = feedback && !feedback.success;

                  return (
                    <div className="space-y-4 text-xs">
                      {/* Completion Progress Tracker */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                        <div>
                          <span className="font-bold text-foreground text-xs block">Intervention Plan Matrix</span>
                          <span className="text-[11px] text-muted-foreground">All 9 fields must be filled out with actionable community details.</span>
                        </div>
                        <Badge
                          variant={filledCount === 9 ? "default" : "outline"}
                          className={`font-mono text-xs shrink-0 ${
                            filledCount === 9
                              ? "bg-primary text-primary-foreground font-bold"
                              : "border-amber-500/50 text-amber-700 dark:text-amber-300 font-semibold"
                          }`}
                        >
                          {filledCount} of 9 Completed
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span>Project Title</span>
                            <span className="text-destructive font-bold">*</span>
                          </Label>
                          <Input
                            value={planData.projectTitle}
                            onChange={(e) => setPlanData({ ...planData, projectTitle: e.target.value })}
                            className={isMissingErr && !planData.projectTitle?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                            disabled={isReadOnly || loading}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span>Goal</span>
                            <span className="text-destructive font-bold">*</span>
                          </Label>
                          <Input
                            value={planData.goal}
                            onChange={(e) => setPlanData({ ...planData, goal: e.target.value })}
                            placeholder="e.g. Reduce estero dumping by 80%"
                            className={isMissingErr && !planData.goal?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                            disabled={isReadOnly || loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold flex items-center justify-between">
                          <span>Objectives</span>
                          <span className="text-destructive font-bold">*</span>
                        </Label>
                        <Textarea
                          value={planData.objectives}
                          onChange={(e) => setPlanData({ ...planData, objectives: e.target.value })}
                          className={`min-h-[60px] ${isMissingErr && !planData.objectives?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          placeholder="Specific, measurable goals..."
                          disabled={isReadOnly || loading}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold flex items-center justify-between">
                          <span>Activities</span>
                          <span className="text-destructive font-bold">*</span>
                        </Label>
                        <Textarea
                          value={planData.activities}
                          onChange={(e) => setPlanData({ ...planData, activities: e.target.value })}
                          className={`min-h-[60px] ${isMissingErr && !planData.activities?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          placeholder="Key actions, clean-up drives, and community events..."
                          disabled={isReadOnly || loading}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span>Stakeholders</span>
                            <span className="text-destructive font-bold">*</span>
                          </Label>
                          <Input
                            value={planData.stakeholders}
                            onChange={(e) => setPlanData({ ...planData, stakeholders: e.target.value })}
                            placeholder="e.g. SK Youth, Barangay Tanods, Residents"
                            className={isMissingErr && !planData.stakeholders?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                            disabled={isReadOnly || loading}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span>Resources</span>
                            <span className="text-destructive font-bold">*</span>
                          </Label>
                          <Input
                            value={planData.resources}
                            onChange={(e) => setPlanData({ ...planData, resources: e.target.value })}
                            placeholder="e.g. Color-coded bins, collection carts, flyers"
                            className={isMissingErr && !planData.resources?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                            disabled={isReadOnly || loading}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span>Budget</span>
                            <span className="text-destructive font-bold">*</span>
                          </Label>
                          <Input
                            value={planData.budget}
                            onChange={(e) => setPlanData({ ...planData, budget: e.target.value })}
                            placeholder="e.g. ₱15,000 SK Fund / Barangay allocation"
                            className={isMissingErr && !planData.budget?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                            disabled={isReadOnly || loading}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span>Timeline</span>
                            <span className="text-destructive font-bold">*</span>
                          </Label>
                          <Input
                            value={planData.timeline}
                            onChange={(e) => setPlanData({ ...planData, timeline: e.target.value })}
                            placeholder="e.g. 3-month rollout (Weeks 1-12)"
                            className={isMissingErr && !planData.timeline?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                            disabled={isReadOnly || loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold flex items-center justify-between">
                          <span>Expected Outcomes</span>
                          <span className="text-destructive font-bold">*</span>
                        </Label>
                        <Textarea
                          value={planData.expectedOutcomes}
                          onChange={(e) => setPlanData({ ...planData, expectedOutcomes: e.target.value })}
                          className={`min-h-[60px] ${isMissingErr && !planData.expectedOutcomes?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          placeholder="Cleaner public spaces, reduced health risks, increased community pride..."
                          disabled={isReadOnly || loading}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* STEP 6: Anticipate Challenges */}
                {step === 6 && (
                  <div className="space-y-5">
                    <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30 space-y-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                        Scenario Event:
                      </span>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                        {missionData.unexpectedEvent.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold block">What are you going to do?</label>
                      <div className="space-y-2">
                        {missionData.unexpectedEvent.options.map((opt) => (
                          <div
                            key={opt.id}
                            onClick={() => !isReadOnly && setSelectedChallengeOptId(opt.id)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                              isReadOnly ? "cursor-default opacity-85" : "cursor-pointer hover:bg-muted/50"
                            } ${
                              selectedChallengeOptId === opt.id
                                ? "bg-primary/10 border-primary text-primary font-semibold"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                  selectedChallengeOptId === opt.id ? "border-primary bg-primary text-white" : ""
                                }`}
                              >
                                {selectedChallengeOptId === opt.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                              </div>
                              <span>{opt.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold block">Justify your adaptive decision:</label>
                      <Textarea
                        value={step6Justification}
                        onChange={(e) => setStep6Justification(e.target.value)}
                        placeholder="Explain how this decision balances immediate limitations with long-term goals..."
                        className="min-h-[90px]"
                        disabled={isReadOnly || loading}
                      />
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

                  const isMissingErr = feedback && !feedback.success && feedback.message.includes("missing:");
                  const selectedOpt = missionData.unexpectedEvent.options.find((o) => o.id === selectedChallengeOptId);

                  return (
                    <div className="space-y-5">
                      {/* Challenge Context Banner */}
                      <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            Challenge Encountered in Step 6:
                          </span>
                          <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-800 dark:text-amber-300">
                            Strategy: {selectedOpt ? selectedOpt.text.slice(0, 35) + "..." : "Selected Option"}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-amber-950 dark:text-amber-100">
                          {missionData.unexpectedEvent.description}
                        </p>
                        {step6Justification && (
                          <div className="pt-2 border-t border-amber-500/20 text-xs text-amber-900/80 dark:text-amber-200/80">
                            <span className="font-semibold">Your Decision Justification: </span>
                            <em>"{step6Justification}"</em>
                          </div>
                        )}
                      </div>

                      {/* Collapsible Original Plan Reference Accordion */}
                      <div className="border border-border rounded-xl overflow-hidden bg-muted/20">
                        <button
                          type="button"
                          onClick={() => setShowOriginalPlanRef(!showOriginalPlanRef)}
                          className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-primary" />
                            <span>View Original Step 5 Plan (Reference Only)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-normal text-muted-foreground hidden sm:inline">
                              {showOriginalPlanRef ? "Hide Original" : "Show Original"}
                            </span>
                            {showOriginalPlanRef ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </button>

                        {showOriginalPlanRef && (
                          <div className="p-4 border-t border-border bg-card space-y-3 text-xs animate-fade-in-up">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <span className="font-bold text-muted-foreground block text-[11px]">Original Project Title:</span>
                                <p className="font-medium text-foreground mt-0.5">{planData.projectTitle || "N/A"}</p>
                              </div>
                              <div>
                                <span className="font-bold text-muted-foreground block text-[11px]">Original Goal:</span>
                                <p className="font-medium text-foreground mt-0.5">{planData.goal || "N/A"}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                              <div>
                                <span className="font-bold text-muted-foreground block text-[11px]">Original Budget:</span>
                                <p className="font-medium text-foreground mt-0.5">{planData.budget || "N/A"}</p>
                              </div>
                              <div>
                                <span className="font-bold text-muted-foreground block text-[11px]">Original Timeline:</span>
                                <p className="font-medium text-foreground mt-0.5">{planData.timeline || "N/A"}</p>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-border/60">
                              <span className="font-bold text-muted-foreground block text-[11px]">Original Activities:</span>
                              <p className="font-medium text-foreground mt-0.5 whitespace-pre-wrap">{planData.activities || "N/A"}</p>
                            </div>
                            <div className="pt-2 border-t border-border/60">
                              <span className="font-bold text-muted-foreground block text-[11px]">Original Stakeholders & Roles:</span>
                              <p className="font-medium text-foreground mt-0.5">{planData.stakeholders || "N/A"}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Header Tracker with Reset Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                        <div>
                          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <FileEdit className="h-4 w-4 text-primary" />
                            <span>Adaptive Action Plan Matrix</span>
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Update your activities, budget, timeline, or roles to accommodate the challenge.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRevisedPlanData({ ...planData });
                            }}
                            disabled={isReadOnly || loading}
                            className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground gap-1"
                            title="Reset all fields back to your Step 5 original plan"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Reset to Initial Plan</span>
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

                      {/* 9-Field Matrix for revisedPlanData (Matching Step 5 exactly) */}
                      <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold flex items-center justify-between">
                              <span>Project Title</span>
                              <span className="text-destructive font-bold">*</span>
                            </Label>
                            <Input
                              value={revisedPlanData.projectTitle}
                              onChange={(e) => setRevisedPlanData({ ...revisedPlanData, projectTitle: e.target.value })}
                              className={isMissingErr && !revisedPlanData.projectTitle?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                              disabled={isReadOnly || loading}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold flex items-center justify-between">
                              <span>Goal</span>
                              <span className="text-destructive font-bold">*</span>
                            </Label>
                            <Input
                              value={revisedPlanData.goal}
                              onChange={(e) => setRevisedPlanData({ ...revisedPlanData, goal: e.target.value })}
                              placeholder="e.g. Reduce estero dumping by 80%"
                              className={isMissingErr && !revisedPlanData.goal?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                              disabled={isReadOnly || loading}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span>Objectives</span>
                            <span className="text-destructive font-bold">*</span>
                          </Label>
                          <Textarea
                            value={revisedPlanData.objectives}
                            onChange={(e) => setRevisedPlanData({ ...revisedPlanData, objectives: e.target.value })}
                            className={`min-h-[60px] ${isMissingErr && !revisedPlanData.objectives?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            placeholder="Specific, measurable goals..."
                            disabled={isReadOnly || loading}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span>Activities</span>
                            <span className="text-destructive font-bold">*</span>
                          </Label>
                          <Textarea
                            value={revisedPlanData.activities}
                            onChange={(e) => setRevisedPlanData({ ...revisedPlanData, activities: e.target.value })}
                            className={`min-h-[60px] ${isMissingErr && !revisedPlanData.activities?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            placeholder="Key actions, clean-up drives, and community events..."
                            disabled={isReadOnly || loading}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold flex items-center justify-between">
                              <span>Stakeholders</span>
                              <span className="text-destructive font-bold">*</span>
                            </Label>
                            <Input
                              value={revisedPlanData.stakeholders}
                              onChange={(e) => setRevisedPlanData({ ...revisedPlanData, stakeholders: e.target.value })}
                              placeholder="e.g. SK Youth, Barangay Tanods, Residents"
                              className={isMissingErr && !revisedPlanData.stakeholders?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                              disabled={isReadOnly || loading}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold flex items-center justify-between">
                              <span>Resources</span>
                              <span className="text-destructive font-bold">*</span>
                            </Label>
                            <Input
                              value={revisedPlanData.resources}
                              onChange={(e) => setRevisedPlanData({ ...revisedPlanData, resources: e.target.value })}
                              placeholder="e.g. Color-coded bins, collection carts, flyers"
                              className={isMissingErr && !revisedPlanData.resources?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                              disabled={isReadOnly || loading}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold flex items-center justify-between">
                              <span>Budget</span>
                              <span className="text-destructive font-bold">*</span>
                            </Label>
                            <Input
                              value={revisedPlanData.budget}
                              onChange={(e) => setRevisedPlanData({ ...revisedPlanData, budget: e.target.value })}
                              placeholder="e.g. ₱15,000 SK Fund / Barangay allocation"
                              className={isMissingErr && !revisedPlanData.budget?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                              disabled={isReadOnly || loading}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold flex items-center justify-between">
                              <span>Timeline</span>
                              <span className="text-destructive font-bold">*</span>
                            </Label>
                            <Input
                              value={revisedPlanData.timeline}
                              onChange={(e) => setRevisedPlanData({ ...revisedPlanData, timeline: e.target.value })}
                              placeholder="e.g. 3-month rollout (Weeks 1-12)"
                              className={isMissingErr && !revisedPlanData.timeline?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}
                              disabled={isReadOnly || loading}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span>Expected Outcomes</span>
                            <span className="text-destructive font-bold">*</span>
                          </Label>
                          <Textarea
                            value={revisedPlanData.expectedOutcomes}
                            onChange={(e) => setRevisedPlanData({ ...revisedPlanData, expectedOutcomes: e.target.value })}
                            className={`min-h-[60px] ${isMissingErr && !revisedPlanData.expectedOutcomes?.trim() ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            placeholder="Cleaner public spaces, reduced health risks, increased community pride..."
                            disabled={isReadOnly || loading}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* STEP 8: Assess Community Impact */}
                {step === 8 && (
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Short-Term Impact</Label>
                      <Textarea
                        value={impactData.shortTermImpact}
                        onChange={(e) => setImpactData({ ...impactData, shortTermImpact: e.target.value })}
                        placeholder="Immediate positive outcomes within 1-4 weeks..."
                        className="min-h-[65px]"
                        disabled={isReadOnly || loading}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Long-Term Impact</Label>
                      <Textarea
                        value={impactData.longTermImpact}
                        onChange={(e) => setImpactData({ ...impactData, longTermImpact: e.target.value })}
                        placeholder="Sustainable environmental and civic behavior shifts over months/years..."
                        className="min-h-[65px]"
                        disabled={isReadOnly || loading}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Possible Risks & Mitigations</Label>
                      <Textarea
                        value={impactData.possibleRisks}
                        onChange={(e) => setImpactData({ ...impactData, possibleRisks: e.target.value })}
                        placeholder="Potential obstacles and preventative steps..."
                        className="min-h-[65px]"
                        disabled={isReadOnly || loading}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Who Benefits?</Label>
                        <Input
                          value={impactData.whoBenefits}
                          onChange={(e) => setImpactData({ ...impactData, whoBenefits: e.target.value })}
                          placeholder="Riverside residents, youth, Tanods"
                          disabled={isReadOnly || loading}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Who Might Be Affected?</Label>
                        <Input
                          value={impactData.whoMightBeAffected}
                          onChange={(e) => setImpactData({ ...impactData, whoMightBeAffected: e.target.value })}
                          placeholder="Illegal dumpers, vendor schedules"
                          disabled={isReadOnly || loading}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Feedback Notification */}
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
                            {feedback.success ? "AI Verification: Step Validated!" : "AI Verification: Revision Required"}
                          </AlertTitle>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {feedback.evaluation?.step_score !== undefined && (
                              <Badge variant={feedback.success ? "default" : "destructive"} className="text-[10px] font-mono font-bold">
                                Score: {feedback.evaluation.step_score}%
                              </Badge>
                            )}
                            {feedback.evaluation?.flags?.map((flag) => (
                              <Badge key={flag} variant="outline" className="text-[10px] font-mono border-rose-500/40 text-rose-700 dark:text-rose-300">
                                {flag}
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
                            <span>AI-Generated Content Flagged: Please rewrite using your own authentic student voice.</span>
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

              <CardFooter className="bg-muted/20 border-t p-3 sm:p-4 flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-4">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading} className="w-full sm:w-auto">
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                <Button onClick={handleNextStep} disabled={loading} className="gap-2 font-bold px-6 w-full sm:w-auto">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Continue Mission <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Panel: Mission Tips */}
          <div className="xl:col-span-4 space-y-4">
            <Card className="border border-amber-500/20 bg-amber-500/5 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Lightbulb className="h-4 w-4" /> Mission Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed space-y-2">
                <p>{missionData.stepTips[step] || "Read carefully and ground your plan in authentic evidence."}</p>
                <div className="pt-2 border-t border-amber-500/20 text-[11px] italic">
                  Tip: Senior High School Civic Engagement standards emphasize evidence, sustainability, and community consultation.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
