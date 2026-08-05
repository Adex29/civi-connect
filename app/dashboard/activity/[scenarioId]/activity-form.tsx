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
} from "lucide-react";
import { Scenario, Submission, SimulationStateData, EvidenceItem } from "@/lib/definitions";
import { getMissionDataForScenario } from "@/lib/mission-data";
import { StepTracker } from "@/components/simulation/step-tracker";
import { CauseRanker } from "@/components/simulation/cause-ranker";
import { EvidenceLibrary, EvaluatedEvidence } from "@/components/simulation/evidence-library";
import { StakeholderChat } from "@/components/simulation/stakeholder-chat";
import { PerformanceReport } from "@/components/simulation/performance-report";
import { processSimulationStepAction, submitReflectionAction } from "./actions";

export function ActivityForm({
  scenario,
  studentName = "Student",
  existingSubmission,
}: {
  scenario: Scenario;
  studentName?: string;
  existingSubmission?: Submission | null;
}) {
  const router = useRouter();
  const missionData = getMissionDataForScenario(scenario);

  // Initialize state from existing submission or start at step 1
  const initialState: SimulationStateData = existingSubmission?.simulationState || {
    currentStep: 1,
  };

  const [step, setStep] = useState<number>(initialState.currentStep || 1);
  const [simState, setSimState] = useState<SimulationStateData>(initialState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
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

  // --- Step 5 State ---
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

  // --- Step 6 State ---
  const [selectedChallengeOptId, setSelectedChallengeOptId] = useState<string>(
    simState.step6?.selectedOptionId || missionData.unexpectedEvent.options[0]?.id || ""
  );
  const [step6Justification, setStep6Justification] = useState<string>(
    simState.step6?.justification || ""
  );

  // --- Step 7 State ---
  const [impactData, setImpactData] = useState({
    shortTermImpact: simState.step7?.impact?.shortTermImpact || "",
    longTermImpact: simState.step7?.impact?.longTermImpact || "",
    possibleRisks: simState.step7?.impact?.possibleRisks || "",
    whoBenefits: simState.step7?.impact?.whoBenefits || "",
    whoMightBeAffected: simState.step7?.impact?.whoMightBeAffected || "",
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
    setLoading(true);
    setFeedback(null);

    let payload: any = {};

    if (step === 1) {
      payload = { selectedIssue, justification: step1Justification };
    } else if (step === 2) {
      payload = { orderedCauseIds };
    } else if (step === 3) {
      const totalEvCount = missionData.evidenceLibrary?.length || 0;
      if (evaluatedEvidences.length < totalEvCount) {
        setLoading(false);
        setFeedback({
          success: false,
          message: `You have evaluated ${evaluatedEvidences.length} of ${totalEvCount} evidence sources. Please inspect and evaluate all remaining evidence sources before proceeding.`,
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
      payload = { impact: impactData };
    }

    const res = await processSimulationStepAction(scenario.id, step, payload);
    setLoading(false);

    if (res.success) {
      setFeedback({ success: true, message: res.feedback });

      if (step === 1 && !showStep1RevisionPrompt) {
        setShowStep1RevisionPrompt(true);
        return;
      }

      if (res.nextStep) {
        setStep(res.nextStep);
      }
    } else {
      setFeedback({ success: false, message: res.feedback || "Please revise your response." });
    }
  };

  const handleFinalReflectionSubmit = async () => {
    setLoading(true);
    setFeedback(null);

    const res = await submitReflectionAction(scenario.id, reflectionAnswer);
    setLoading(false);

    if (res.success) {
      setStep(9); // 9 = Completion screen
    } else {
      setFeedback({ success: false, message: res.feedback || "Please revise your reflection answer." });
    }
  };

  const completedSteps = Array.from({ length: Math.min(step - 1, 7) }, (_, i) => i + 1);

  // --- Step 8: Performance Report View ---
  if (step === 8 && simState.scores) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <PerformanceReport
          scores={simState.scores}
          studentName={studentName}
          onContinueToReflection={() => {
            setStep(8.5); // 8.5 = Final Reflection Form
          }}
        />
      </div>
    );
  }

  // --- Step 8.5 / 9: Final Reflection & Completion Certificate View ---
  if (step === 8.5) {
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
                <Sparkles
                  className={`h-4 w-4 shrink-0 ${
                    feedback.success ? "text-primary" : "text-rose-600"
                  }`}
                />
                <AlertTitle className="font-bold text-xs flex items-center gap-1.5">
                  {feedback.success ? "AI Insights: Reflection Validated!" : "AI Insights: Revision Suggested"}
                </AlertTitle>
                <AlertDescription className="text-xs leading-relaxed mt-1 italic">
                  "{feedback.message}"
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="bg-muted/20 border-t p-4 flex justify-end">
            <Button onClick={handleFinalReflectionSubmit} disabled={loading || !reflectionAnswer.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Reflection & Complete Mission
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (step === 9 || existingSubmission?.status === "completed") {
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
        />
      </div>

      {/* Main Panel & Right Panel Container */}
      <div className="lg:col-span-9 space-y-6">
        {/* Step Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-primary/5 p-3 sm:p-4 rounded-xl border border-primary/20">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Mission Step 0{step} of 07
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">
              {step === 1 && "Identify Community Issues"}
              {step === 2 && "Analyze Causes"}
              {step === 3 && "Evaluate Digital Evidence"}
              {step === 4 && "Consult Simulated Stakeholders"}
              {step === 5 && "Develop an Intervention Plan"}
              {step === 6 && "Anticipate Challenges (Simulation)"}
              {step === 7 && "Assess Community Impact"}
            </h2>
          </div>
          <span className="text-xs font-bold font-mono px-3 py-1 bg-primary text-primary-foreground rounded-full shrink-0 w-fit">
            {Math.round((step / 7) * 100)}% Complete
          </span>
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
                  {step === 7 && "Community Impact Assessment"}
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
                            onClick={() => setSelectedIssue(issue)}
                            className={`p-3 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
                              selectedIssue === issue
                                ? "bg-primary/10 border-primary text-primary font-semibold"
                                : "hover:bg-muted/50"
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
                    />
                  </div>
                )}

                {/* STEP 3: Evaluate Digital Evidence */}
                {step === 3 && (
                  <EvidenceLibrary
                    items={missionData.evidenceLibrary}
                    evaluated={evaluatedEvidences}
                    onUpdateEvaluated={(evs) => setEvaluatedEvidences(evs)}
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
                  />
                )}

                {/* STEP 5: Develop an Intervention Plan */}
                {step === 5 && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Project Title</Label>
                        <Input
                          value={planData.projectTitle}
                          onChange={(e) => setPlanData({ ...planData, projectTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Goal</Label>
                        <Input
                          value={planData.goal}
                          onChange={(e) => setPlanData({ ...planData, goal: e.target.value })}
                          placeholder="e.g. Reduce estero dumping by 80%"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Objectives</Label>
                      <Textarea
                        value={planData.objectives}
                        onChange={(e) => setPlanData({ ...planData, objectives: e.target.value })}
                        className="min-h-[60px]"
                        placeholder="Specific, measurable goals..."
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Activities</Label>
                      <Textarea
                        value={planData.activities}
                        onChange={(e) => setPlanData({ ...planData, activities: e.target.value })}
                        className="min-h-[60px]"
                        placeholder="Key actions and events..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Stakeholders & Roles</Label>
                        <Input
                          value={planData.stakeholders}
                          onChange={(e) => setPlanData({ ...planData, stakeholders: e.target.value })}
                          placeholder="SK, Barangay Tanods, Residents"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Resources Needed</Label>
                        <Input
                          value={planData.resources}
                          onChange={(e) => setPlanData({ ...planData, resources: e.target.value })}
                          placeholder="Color-coded bins, pedicabs, flyers"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Budget Allocation</Label>
                        <Input
                          value={planData.budget}
                          onChange={(e) => setPlanData({ ...planData, budget: e.target.value })}
                          placeholder="₱15,000 SK / Eco-brick revenue"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Timeline</Label>
                        <Input
                          value={planData.timeline}
                          onChange={(e) => setPlanData({ ...planData, timeline: e.target.value })}
                          placeholder="3-month rollout"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Expected Outcomes</Label>
                      <Textarea
                        value={planData.expectedOutcomes}
                        onChange={(e) => setPlanData({ ...planData, expectedOutcomes: e.target.value })}
                        className="min-h-[60px]"
                        placeholder="Cleaner waterways, reduced flood risks..."
                      />
                    </div>
                  </div>
                )}

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
                            onClick={() => setSelectedChallengeOptId(opt.id)}
                            className={`p-3 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
                              selectedChallengeOptId === opt.id
                                ? "bg-primary/10 border-primary text-primary font-semibold"
                                : "hover:bg-muted/50"
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
                      />
                    </div>
                  </div>
                )}

                {/* STEP 7: Assess Community Impact */}
                {step === 7 && (
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Short-Term Impact</Label>
                      <Textarea
                        value={impactData.shortTermImpact}
                        onChange={(e) => setImpactData({ ...impactData, shortTermImpact: e.target.value })}
                        placeholder="Immediate positive outcomes within 1-4 weeks..."
                        className="min-h-[65px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Long-Term Impact</Label>
                      <Textarea
                        value={impactData.longTermImpact}
                        onChange={(e) => setImpactData({ ...impactData, longTermImpact: e.target.value })}
                        placeholder="Sustainable environmental and civic behavior shifts over months/years..."
                        className="min-h-[65px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Possible Risks & Mitigations</Label>
                      <Textarea
                        value={impactData.possibleRisks}
                        onChange={(e) => setImpactData({ ...impactData, possibleRisks: e.target.value })}
                        placeholder="Potential obstacles and preventative steps..."
                        className="min-h-[65px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Who Benefits?</Label>
                        <Input
                          value={impactData.whoBenefits}
                          onChange={(e) => setImpactData({ ...impactData, whoBenefits: e.target.value })}
                          placeholder="Riverside residents, youth, Tanods"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Who Might Be Affected?</Label>
                        <Input
                          value={impactData.whoMightBeAffected}
                          onChange={(e) => setImpactData({ ...impactData, whoMightBeAffected: e.target.value })}
                          placeholder="Illegal dumpers, vendor schedules"
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
                    <Sparkles
                      className={`h-4 w-4 shrink-0 ${
                        feedback.success ? "text-primary" : "text-rose-600"
                      }`}
                    />
                    <AlertTitle className="font-bold text-xs flex items-center gap-1.5">
                      {feedback.success ? "AI Insights: Step Validated!" : "AI Insights: Revision Suggested"}
                    </AlertTitle>
                    <AlertDescription className="text-xs leading-relaxed mt-1 italic">
                      "{feedback.message}"
                    </AlertDescription>
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
                  [Continue Mission] <ArrowRight className="h-4 w-4" />
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
