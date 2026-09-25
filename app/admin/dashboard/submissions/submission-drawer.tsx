"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  CheckCircle,
  Clock,
  Eye,
  User,
  GraduationCap,
  Award,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Users,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Classroom, Scenario, Student, Submission, AIEvaluationResult } from "@/lib/definitions";
import { formatFlagLabel, extractSubmissionAiAnalysis } from "@/lib/flag-utils";
import { getMissionDataForScenario } from "@/lib/mission-data";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineContent,
} from "@/components/ui/timeline";

function StepAiEvaluationBox({
  stepNumber,
  evaluation,
  fallbackFeedback,
}: {
  stepNumber: number | string;
  evaluation?: AIEvaluationResult;
  fallbackFeedback?: string;
}) {
  const isAi = Boolean(
    evaluation?.is_ai_generated ||
    evaluation?.flags?.some((f) => f === "AI_GENERATED_CONTENT" || f === "AI_REVIEW_REQUIRED" || f === "AI_REVIEW_RECOMMENDED")
  );
  const score = evaluation?.step_score;
  const summary = evaluation?.evaluation_summary;
  const feedback = evaluation?.actionable_feedback || fallbackFeedback;
  const flags = evaluation?.flags || [];
  const strengths = evaluation?.strengths || [];
  const improvements = evaluation?.areas_for_improvement || [];

  if (!evaluation && !fallbackFeedback) return null;

  return (
    <div
      className={`mt-2 p-3 rounded-lg border text-xs space-y-2 ${
        isAi
          ? "bg-rose-500/10 border-rose-500/35 text-rose-950 dark:text-rose-200"
          : "bg-muted/40 border-border/70 text-foreground"
      }`}
    >
      {/* Header bar: Diagnostic label, Score & Voice status */}
      <div className="flex items-center justify-between flex-wrap gap-1.5 pb-1 border-b border-border/40">
        <span className="font-bold flex items-center gap-1.5 text-primary">
          <FileText className="h-3.5 w-3.5 shrink-0" />
          AI Step {stepNumber} Diagnostic
        </span>
        <div className="flex items-center gap-1.5">
          {score !== undefined && (
            <Badge
              variant={score >= 70 ? "outline" : "destructive"}
              className={`font-mono text-[10px] ${
                score >= 70
                  ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10"
                  : ""
              }`}
            >
              Step Score: {score}%
            </Badge>
          )}
          {isAi ? (
            <Badge variant="destructive" className="gap-1 text-[10px] font-bold">
              <ShieldAlert className="h-3 w-3" /> AI Content Flagged
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
            >
              <CheckCircle2 className="h-3 w-3" /> Authentic Voice
            </Badge>
          )}
        </div>
      </div>

      {/* Prominent alert if AI detected */}
      {isAi && (
        <div className="p-2 rounded bg-rose-500/20 border border-rose-500/40 text-rose-900 dark:text-rose-100 font-semibold text-[11px] flex items-start gap-1.5">
          <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span>Flagged for AI Authorship / Formulaic Clichés.</span>
            {evaluation?.ai_confidence_score && (
              <span className="ml-1 font-mono text-[10px] opacity-85">
                (Confidence: {evaluation.ai_confidence_score}%)
              </span>
            )}
            <p className="text-[10px] font-normal mt-0.5 opacity-90">
              Student was instructed to rewrite in their own authentic student voice.
            </p>
          </div>
        </div>
      )}

      {/* Rubric Flags */}
      {flags.length > 0 && (
        <div className="flex gap-1 flex-wrap items-center">
          <span className="text-[10px] font-semibold text-muted-foreground mr-1">Rubric Flags:</span>
          {flags.map((f) => (
            <Badge
              key={f}
              variant={f === "AI_GENERATED_CONTENT" ? "destructive" : "outline"}
              className={`text-[9px] ${
                f !== "AI_GENERATED_CONTENT" ? "text-amber-700 dark:text-amber-400 border-amber-500/30" : ""
              }`}
            >
              {formatFlagLabel(f)}
            </Badge>
          ))}
        </div>
      )}

      {/* AI Summary */}
      {summary && (
        <p className="text-[11px] leading-relaxed">
          <strong className="text-foreground">AI Evaluation:</strong> {summary}
        </p>
      )}

      {/* Actionable Feedback */}
      {feedback && (
        <p className="text-[11px] text-muted-foreground italic leading-relaxed bg-background/50 p-2 rounded border border-border/40">
          &ldquo;{feedback}&rdquo;
        </p>
      )}

      {/* Strengths & Improvements */}
      {(strengths.length > 0 || improvements.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5 border-t border-border/40 text-[10px]">
          {strengths.length > 0 && (
            <div>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">Strengths:</span>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                {strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {improvements.length > 0 && (
            <div>
              <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">Areas for Growth:</span>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                {improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SubmissionDrawer({
  submission,
  student,
  scenario,
  classroom,
}: {
  submission: Submission;
  student: Student;
  scenario: Scenario;
  classroom?: Classroom;
}) {
  const [open, setOpen] = useState(false);
  const simState = submission.simulationState;
  const scores = simState?.scores;
  const missionData = getMissionDataForScenario(scenario);
  const aiAnalysis = extractSubmissionAiAnalysis(submission);

  const competencyDimensions = [
    { label: "Community Investigation", score: scores?.communityInvestigation ?? 85, desc: "Issue identification & local context accuracy" },
    { label: "Evidence Evaluation", score: scores?.evidenceEvaluation ?? 88, desc: "Source credibility & evidentiary linkage" },
    { label: "Stakeholder Analysis", score: scores?.stakeholderAnalysis ?? 90, desc: "Inclusivity & synthesis of diverse viewpoints" },
    { label: "Community Action Planning", score: scores?.interventionPlanning ?? 88, desc: "Feasibility, itemized budget & timeline realism" },
    { label: "Adaptive Decision-Making", score: scores?.adaptiveDecisionMaking ?? 86, desc: "Contingency problem-solving under obstacles" },
    { label: "Adaptive Plan Revision", score: scores?.planRevision ?? scores?.interventionPlanning ?? 88, desc: "Resilient refinement following challenge simulation" },
  ];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
            <Eye className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Inspect Submission & AI Verification</span>
            <span className="sm:hidden">Inspect</span>
          </Button>
        }
      />
      <DrawerContent side="right" className="w-full max-w-lg sm:max-w-2xl">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {submission.status === "completed" ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Completed
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3.5 w-3.5" /> In Progress (Step {submission.stepProgress || 1}/7)
              </Badge>
            )}
            {submission.score !== null && submission.score !== undefined && (
              <Badge variant="outline" className="gap-1 font-bold">
                <Award className="h-3.5 w-3.5 text-primary" /> Overall Civic Score: {submission.score}%
              </Badge>
            )}
            {aiAnalysis.hasAiFlag ? (
              <Badge variant="destructive" className="gap-1 font-bold">
                <ShieldAlert className="h-3.5 w-3.5" /> AI Content Flagged (Step {aiAnalysis.flaggedSteps.join(", ")})
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified Student Voice
              </Badge>
            )}
          </div>
          <DrawerTitle className="text-xl mt-2">{scenario.title}</DrawerTitle>
          <DrawerDescription>
            Student civic simulation submission & Civi-Tech AI Verification audit log.
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto p-4 space-y-6 flex-1 text-sm">
          {/* AI Detection Banner */}
          {aiAnalysis.hasAiFlag && (
            <Alert variant="destructive" className="bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              <AlertTitle className="font-bold text-xs">AI-Generated Content Flagged</AlertTitle>
              <AlertDescription className="text-xs leading-relaxed mt-1">
                The Civi-Tech AI evaluation engine flagged AI-generated phrasing or assistant scaffolding in{" "}
                <strong>Step(s) {aiAnalysis.flaggedSteps.join(", ")}</strong>. Review the individual step diagnostics below to evaluate student authenticity.
              </AlertDescription>
            </Alert>
          )}

          {/* Student metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border text-xs">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-muted-foreground">Student</p>
                <p className="font-semibold text-foreground">{student.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-muted-foreground">LRN</p>
                <p className="font-mono font-semibold text-foreground">{student.lrn}</p>
              </div>
            </div>
            {classroom && (
              <div>
                <p className="text-muted-foreground">Classroom</p>
                <p className="font-semibold text-foreground">{classroom.name}</p>
              </div>
            )}
            {student.groupId && (
              <div>
                <p className="text-muted-foreground">Group</p>
                <p className="font-semibold text-foreground">Group {student.groupId}</p>
              </div>
            )}
          </div>

          {/* 6-Core Competency Audit Card */}
          {scores && (
            <div className="space-y-3 p-4 rounded-xl border bg-card shadow-2xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary" /> 6-Core Competency Scores
                </h4>
                <Badge variant="default" className="font-mono font-bold">
                  {scores.overallScore}% Overall
                </Badge>
              </div>
              <div className="space-y-2.5 pt-1">
                {competencyDimensions.map((dim, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span>{dim.label}</span>
                      <span className="font-mono font-bold text-primary">{dim.score}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step AI Verification Audit Logs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Step-by-Step Student Work & AI Evaluation Responses
            </h4>
            <Timeline>
              {/* Step 1 */}
              {simState?.step1 && (
                <TimelineItem>
                  <TimelineDot status={simState.step1.passed ? "completed" : "current"}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </TimelineDot>
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineHeader>
                      <TimelineTitle className="text-xs font-bold">Step 1: Priority Issue & Justification</TimelineTitle>
                      <span className="text-[10px] font-bold text-primary">
                        {simState.step1.selectedIssue}
                      </span>
                    </TimelineHeader>
                    <p className="text-xs text-foreground p-2.5 bg-muted/20 border rounded-md mt-1">
                      &ldquo;{simState.step1.justification}&rdquo;
                    </p>
                    <StepAiEvaluationBox
                      stepNumber={1}
                      evaluation={simState.step1.evaluation}
                      fallbackFeedback={simState.step1.feedback}
                    />
                  </TimelineContent>
                </TimelineItem>
              )}

              {/* Step 2 Root Cause Analysis */}
              {simState?.step2 && (
                <TimelineItem>
                  <TimelineDot status={simState.step2.passed ? "completed" : "current"}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </TimelineDot>
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineHeader>
                      <TimelineTitle className="text-xs font-bold">Step 2: Root Cause Hierarchy</TimelineTitle>
                    </TimelineHeader>
                    <div className="text-xs space-y-1 p-2.5 bg-muted/20 border rounded-md mt-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                        Ranked Causes (Most Significant → Least):
                      </span>
                      {simState.step2.orderedCauseIds?.map((cId, idx) => {
                        const causeObj = missionData.causes?.find((c) => c.id === cId);
                        return (
                          <div key={cId} className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[10px] w-4 text-primary">#{idx + 1}</span>
                            <span className="font-medium text-foreground">{causeObj?.title || cId}</span>
                          </div>
                        );
                      })}
                    </div>
                    <StepAiEvaluationBox
                      stepNumber={2}
                      evaluation={simState.step2.evaluation}
                      fallbackFeedback={simState.step2.feedback}
                    />
                  </TimelineContent>
                </TimelineItem>
              )}

              {/* Step 3 Evidence Evaluation */}
              {simState?.step3 && (
                <TimelineItem>
                  <TimelineDot status={simState.step3.passed ? "completed" : "current"}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </TimelineDot>
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineHeader>
                      <TimelineTitle className="text-xs font-bold">Step 3: Evidence Evaluation Audit</TimelineTitle>
                    </TimelineHeader>
                    <div className="space-y-2 mt-1">
                      {simState.step3.evaluatedEvidences?.map((ev, idx) => {
                        const evObj = missionData.evidenceLibrary?.find((e) => e.id === ev.evidenceId);
                        return (
                          <div key={idx} className="p-2.5 bg-muted/20 border rounded-md text-xs space-y-1">
                            <div className="flex items-center justify-between font-semibold">
                              <span className="text-foreground">{evObj?.title || ev.evidenceId}</span>
                              <span className="text-amber-500 font-bold">
                                {ev.selectedSupports?.includes("not_related")
                                  ? "N/A (Not Related)"
                                  : ev.userCredibility > 0
                                  ? `${"★".repeat(ev.userCredibility)}${"☆".repeat(Math.max(0, 5 - ev.userCredibility))}`
                                  : "No Rating"}
                              </span>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {ev.selectedSupports?.map((sup) => (
                                <Badge key={sup} variant="secondary" className="text-[9px] uppercase">
                                  {sup.replace("_", " ")}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-muted-foreground italic text-[11px]">
                              &ldquo;{ev.justification}&rdquo;
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <StepAiEvaluationBox
                      stepNumber={3}
                      evaluation={simState.step3.evaluation}
                      fallbackFeedback={simState.step3.feedback}
                    />
                  </TimelineContent>
                </TimelineItem>
              )}

              {/* Step 4 Stakeholder Consultation */}
              {simState?.step4 && (
                <TimelineItem>
                  <TimelineDot status={simState.step4.passed ? "completed" : "current"}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </TimelineDot>
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineHeader>
                      <TimelineTitle className="text-xs font-bold">Step 4: Stakeholder Consultation</TimelineTitle>
                    </TimelineHeader>
                    <div className="text-xs space-y-1.5 p-2.5 bg-muted/20 border rounded-md mt-1">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {simState.step4.consultedStakeholderIds?.map((sId) => {
                          const stObj = missionData.stakeholders?.find((s) => s.id === sId);
                          return (
                            <Badge key={sId} variant="outline" className="text-[10px]">
                              {stObj?.name || sId} ({stObj?.role || "Stakeholder"})
                            </Badge>
                          );
                        })}
                      </div>
                      {simState.step4.interviewNotes && (
                        <p className="text-foreground font-medium">
                          <strong className="text-muted-foreground">Consultation Notes:</strong> &ldquo;{simState.step4.interviewNotes}&rdquo;
                        </p>
                      )}
                    </div>
                    <StepAiEvaluationBox
                      stepNumber={4}
                      evaluation={simState.step4.evaluation}
                      fallbackFeedback={simState.step4.feedback}
                    />
                  </TimelineContent>
                </TimelineItem>
              )}

              {/* Step 5 Intervention Plan */}
              {simState?.step5?.plan && (
                <TimelineItem>
                  <TimelineDot status={simState.step5.passed ? "completed" : "current"}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </TimelineDot>
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineHeader>
                      <TimelineTitle className="text-xs font-bold">Step 5: Community Action Plan</TimelineTitle>
                      <span className="text-[10px] font-bold text-primary">
                        {simState.step5.plan.projectTitle}
                      </span>
                    </TimelineHeader>
                    <div className="text-xs space-y-1.5 p-2.5 bg-muted/20 border rounded-md mt-1 text-muted-foreground">
                      <p><strong className="text-foreground">Goal:</strong> {simState.step5.plan.goal}</p>
                      <p><strong className="text-foreground">Objectives:</strong> {simState.step5.plan.objectives}</p>
                      <p><strong className="text-foreground">Activities:</strong> {simState.step5.plan.activities}</p>
                      <p><strong className="text-foreground">Stakeholders:</strong> {simState.step5.plan.stakeholders}</p>
                      {simState.step5.plan.resources && (
                        <p><strong className="text-foreground">Resources:</strong> {simState.step5.plan.resources}</p>
                      )}
                      <p><strong className="text-foreground">Budget:</strong> {simState.step5.plan.budget} | <strong className="text-foreground">Timeline:</strong> {simState.step5.plan.timeline}</p>
                      <p><strong className="text-foreground">Expected Outcomes:</strong> {simState.step5.plan.expectedOutcomes}</p>
                    </div>
                    <StepAiEvaluationBox
                      stepNumber={5}
                      evaluation={simState.step5.evaluation}
                      fallbackFeedback={simState.step5.feedback}
                    />
                  </TimelineContent>
                </TimelineItem>
              )}

              {/* Step 6 Challenge Simulation */}
              {simState?.step6 && (
                <TimelineItem>
                  <TimelineDot status={simState.step6.passed ? "completed" : "current"}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </TimelineDot>
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineHeader>
                      <TimelineTitle className="text-xs font-bold">Step 6: Challenge Simulation</TimelineTitle>
                    </TimelineHeader>
                    <div className="text-xs p-2.5 bg-muted/20 border rounded-md mt-1 space-y-1.5">
                      {simState.step6.challenge ? (
                        <>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-primary">{simState.step6.challenge.title}</span>
                            <Badge variant="outline" className="text-[10px] font-mono capitalize">
                              {simState.step6.challenge.categoryLabel.replace(/^[A-Z]\.\s*/i, "")}
                            </Badge>
                          </div>
                          <p className="text-foreground leading-relaxed">{simState.step6.challenge.description}</p>
                          <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                            <strong>Affected Component:</strong> <span className="uppercase font-semibold text-primary">{simState.step6.challenge.affectedField}</span>
                          </p>
                        </>
                      ) : (
                        <>
                          {simState.step6.selectedOptionId && (
                            <p className="font-semibold text-primary">
                              Option Selected: {simState.step6.selectedOptionId}
                            </p>
                          )}
                          {simState.step6.justification && (
                            <p className="text-foreground">
                              &ldquo;{simState.step6.justification}&rdquo;
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    <StepAiEvaluationBox
                      stepNumber={6}
                      evaluation={simState.step6.evaluation}
                      fallbackFeedback={simState.step6.feedback}
                    />
                  </TimelineContent>
                </TimelineItem>
              )}

              {/* Step 7 Adaptive Plan Revision */}
              {simState?.step7?.revisedPlan && (
                <TimelineItem>
                  <TimelineDot status={simState.step7.passed ? "completed" : "current"}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </TimelineDot>
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineHeader>
                      <TimelineTitle className="text-xs font-bold">Step 7: Revised Intervention Plan</TimelineTitle>
                      <span className="text-[10px] font-bold text-primary">
                        {simState.step7.revisedPlan.projectTitle}
                      </span>
                    </TimelineHeader>
                    <div className="text-xs space-y-1.5 p-2.5 bg-muted/20 border rounded-md mt-1 text-muted-foreground">
                      <p><strong className="text-foreground">Goal:</strong> {simState.step7.revisedPlan.goal}</p>
                      {simState.step7.revisedPlan.objectives && (
                        <p><strong className="text-foreground">Objectives:</strong> {simState.step7.revisedPlan.objectives}</p>
                      )}
                      <p><strong className="text-foreground">Activities:</strong> {simState.step7.revisedPlan.activities}</p>
                      {simState.step7.revisedPlan.stakeholders && (
                        <p><strong className="text-foreground">Stakeholders:</strong> {simState.step7.revisedPlan.stakeholders}</p>
                      )}
                      {simState.step7.revisedPlan.resources && (
                        <p><strong className="text-foreground">Resources:</strong> {simState.step7.revisedPlan.resources}</p>
                      )}
                      <p><strong className="text-foreground">Budget:</strong> {simState.step7.revisedPlan.budget} | <strong className="text-foreground">Timeline:</strong> {simState.step7.revisedPlan.timeline}</p>
                      {simState.step7.revisedPlan.expectedOutcomes && (
                        <p><strong className="text-foreground">Expected Outcomes:</strong> {simState.step7.revisedPlan.expectedOutcomes}</p>
                      )}
                    </div>
                    <StepAiEvaluationBox
                      stepNumber={7}
                      evaluation={simState.step7.evaluation}
                      fallbackFeedback={simState.step7.feedback}
                    />
                  </TimelineContent>
                </TimelineItem>
              )}
              {/* Final Reflection */}
              {simState?.reflection && (
                <TimelineItem>
                  <TimelineDot status="completed">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </TimelineDot>
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineHeader>
                      <TimelineTitle className="text-xs font-bold">Step 8: Civic Action Reflection</TimelineTitle>
                    </TimelineHeader>
                    <div className="text-xs p-2.5 bg-muted/20 border rounded-md mt-1 space-y-1.5">
                      {simState.reflection.question && (
                        <p className="font-semibold text-primary">
                          Prompt: &ldquo;{simState.reflection.question}&rdquo;
                        </p>
                      )}
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        &ldquo;{simState.reflection.answer}&rdquo;
                      </p>
                    </div>
                    <StepAiEvaluationBox
                      stepNumber="Reflection"
                      evaluation={simState.reflection.evaluation}
                      fallbackFeedback={simState.reflection.feedback}
                    />
                  </TimelineContent>
                </TimelineItem>
              )}

              {/* General Feedback Alert */}
              <TimelineItem>
                <TimelineDot status={submission.feedback ? "completed" : "current"}>
                  <CheckCircle className="h-3.5 w-3.5" />
                </TimelineDot>
                <TimelineConnector />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle className="text-xs font-bold">Overall AI Verification Summary</TimelineTitle>
                  </TimelineHeader>
                  <Alert className="bg-primary/5 border-primary/30 text-foreground mt-2">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <AlertTitle className="text-primary font-bold text-xs">
                      AI Diagnostic Summary
                    </AlertTitle>
                    <AlertDescription className="text-xs italic leading-relaxed mt-1">
                      &ldquo;{submission.feedback || "Simulation in progress..."}&rdquo;
                    </AlertDescription>
                  </Alert>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <DrawerClose
            render={
              <Button variant="outline" className="w-full">
                Close Inspector
              </Button>
            }
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
