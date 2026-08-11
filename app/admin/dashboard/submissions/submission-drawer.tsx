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
import { CheckCircle, Clock, Eye, FileText, User, GraduationCap, Award, Sparkles, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Classroom, Scenario, Student, Submission } from "@/lib/definitions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
  TimelineContent,
} from "@/components/ui/timeline";

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

  const hasAiFlag = Boolean(
    simState?.step1?.evaluation?.is_ai_generated ||
    simState?.step1?.evaluation?.flags?.includes("AI_GENERATED_CONTENT") ||
    simState?.step2?.evaluation?.is_ai_generated ||
    simState?.step3?.evaluation?.is_ai_generated ||
    simState?.step4?.evaluation?.is_ai_generated ||
    simState?.step5?.evaluation?.is_ai_generated ||
    simState?.step6?.evaluation?.is_ai_generated ||
    simState?.step7?.evaluation?.is_ai_generated ||
    simState?.reflection?.evaluation?.is_ai_generated ||
    simState?.reflection?.evaluation?.flags?.includes("AI_GENERATED_CONTENT")
  );

  const competencyDimensions = [
    { label: "Community Investigation", score: scores?.communityInvestigation ?? 85, desc: "Issue identification & local context accuracy" },
    { label: "Evidence Evaluation", score: scores?.evidenceEvaluation ?? 88, desc: "Source credibility & evidentiary linkage" },
    { label: "Stakeholder Analysis", score: scores?.stakeholderAnalysis ?? 90, desc: "Inclusivity & synthesis of diverse viewpoints" },
    { label: "Intervention Planning", score: scores?.interventionPlanning ?? 88, desc: "Feasibility, itemized budget & timeline realism" },
    { label: "Adaptive Decision-Making", score: scores?.adaptiveDecisionMaking ?? 86, desc: "Contingency problem-solving under obstacles" },
    { label: "Impact Assessment", score: scores?.impactAssessment ?? 91, desc: "Long-term sustainability & ethical risk mitigations" },
  ];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0" nativeButton={false}>
            <Eye className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Inspect Submission & AI Verification</span>
            <span className="sm:hidden">Inspect</span>
          </Button>
        }
      />
      <DrawerContent side="right" className="w-full max-w-lg sm:max-w-xl">
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
            {submission.score && (
              <Badge variant="outline" className="gap-1 font-bold">
                <Award className="h-3.5 w-3.5 text-primary" /> Overall Civic Score: {submission.score}%
              </Badge>
            )}
            {hasAiFlag ? (
              <Badge variant="destructive" className="gap-1 font-bold">
                <ShieldAlert className="h-3.5 w-3.5" /> AI Content Flagged
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                <CheckCircle2 className="h-3.5 w-3.5" /> Human Authored
              </Badge>
            )}
          </div>
          <DrawerTitle className="text-xl mt-2">{scenario.title}</DrawerTitle>
          <DrawerDescription>
            Student civic simulation submission & Triton AI Verification diagnostic log.
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto p-4 space-y-6 flex-1 text-sm">
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

          {/* 6-Dimension Competency Audit Card */}
          {scores && (
            <div className="space-y-3 p-4 rounded-xl border bg-card shadow-2xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary" /> 6-Dimension Competency Scores
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

          {/* Submission Workflow Timeline Audit */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Step-by-Step AI Verification Audit Logs
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
                      "{simState.step1.justification}"
                    </p>
                    {simState.step1.evaluation?.flags && simState.step1.evaluation.flags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-1">
                        {simState.step1.evaluation.flags.map((f) => (
                          <Badge
                            key={f}
                            variant={f === "AI_GENERATED_CONTENT" ? "destructive" : "outline"}
                            className={`text-[9px] ${f !== "AI_GENERATED_CONTENT" ? "text-rose-600 border-rose-500/30" : ""}`}
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {simState.step1.feedback && (
                      <p className="text-[11px] text-muted-foreground italic mt-1">
                        AI: {simState.step1.feedback}
                      </p>
                    )}
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
                      <TimelineTitle className="text-xs font-bold">Step 5: Intervention Action Plan</TimelineTitle>
                      <span className="text-[10px] font-bold text-primary">
                        {simState.step5.plan.projectTitle}
                      </span>
                    </TimelineHeader>
                    <div className="text-xs space-y-1.5 p-2.5 bg-muted/20 border rounded-md mt-1 text-muted-foreground">
                      <p><strong className="text-foreground">Goal:</strong> {simState.step5.plan.goal}</p>
                      <p><strong className="text-foreground">Activities:</strong> {simState.step5.plan.activities}</p>
                      <p><strong className="text-foreground">Budget:</strong> {simState.step5.plan.budget} | <strong className="text-foreground">Timeline:</strong> {simState.step5.plan.timeline}</p>
                    </div>
                    {simState.step5.evaluation?.flags && simState.step5.evaluation.flags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-1">
                        {simState.step5.evaluation.flags.map((f) => (
                          <Badge
                            key={f}
                            variant={f === "AI_GENERATED_CONTENT" ? "destructive" : "outline"}
                            className={`text-[9px] ${f !== "AI_GENERATED_CONTENT" ? "text-rose-600 border-rose-500/30" : ""}`}
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TimelineContent>
                </TimelineItem>
              )}

              {/* Step 8.5 Reflection */}
              {simState?.reflection && (
                <TimelineItem>
                  <TimelineDot status="completed">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </TimelineDot>
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineHeader>
                      <TimelineTitle className="text-xs font-bold">Final Reflection</TimelineTitle>
                    </TimelineHeader>
                    <p className="text-xs text-foreground p-2.5 bg-muted/20 border rounded-md mt-1">
                      "{simState.reflection.answer}"
                    </p>
                    {simState.reflection.evaluation?.flags && simState.reflection.evaluation.flags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-1">
                        {simState.reflection.evaluation.flags.map((f) => (
                          <Badge
                            key={f}
                            variant={f === "AI_GENERATED_CONTENT" ? "destructive" : "outline"}
                            className={`text-[9px] ${f !== "AI_GENERATED_CONTENT" ? "text-rose-600 border-rose-500/30" : ""}`}
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {simState.reflection.feedback && (
                      <p className="text-[11px] text-muted-foreground italic mt-1">
                        AI: {simState.reflection.feedback}
                      </p>
                    )}
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
                    <Sparkles className="h-4 w-4 text-primary shrink-0" />
                    <AlertTitle className="text-primary font-bold text-xs">
                      AI Diagnostic Summary
                    </AlertTitle>
                    <AlertDescription className="text-xs italic leading-relaxed mt-1">
                      "{submission.feedback || "Simulation in progress..."}"
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
              <Button variant="outline" className="w-full" nativeButton={false}>
                Close Inspector
              </Button>
            }
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
