"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scenario, Classroom, ClassroomScenario, Submission, Student } from "@/lib/definitions";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssignScenarioDialog } from "./assign-scenario-dialog";
import { unassignScenarioAction } from "./actions";
import { format } from "date-fns";
import {
  BookOpen,
  School,
  FileText,
  Sparkles,
  Edit,
  Trash2,
  ListChecks,
  Users,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Award,
} from "lucide-react";
import { toast } from "sonner";

interface ScenarioDrawerProps {
  scenario: Scenario;
  classrooms: Classroom[];
  assignments: ClassroomScenario[];
  submissions: Submission[];
  students: Student[];
  trigger?: React.ReactNode;
}

export function ScenarioDrawer({
  scenario,
  classrooms,
  assignments,
  submissions,
  students,
  trigger,
}: ScenarioDrawerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Assigned classrooms for this scenario
  const assignedClassrooms = assignments
    .filter((a) => a.scenarioId === scenario.id && a.isActive)
    .map((a) => classrooms.find((c) => c.id === a.classroomId))
    .filter((c): c is Classroom => Boolean(c));

  const assignedClassroomIds = assignedClassrooms.map((c) => c.id);

  // Submissions for this scenario
  const scenarioSubmissions = submissions
    .filter((s) => s.scenarioId === scenario.id)
    .map((sub) => {
      const student = students.find((st) => st.id === sub.studentId);
      const classroom = classrooms.find((c) => c.id === student?.classroomId);
      return { sub, student, classroom };
    });

  const handleUnassign = async (classroomId: string, classroomName: string) => {
    const res = await unassignScenarioAction(scenario.id, classroomId);
    if (res && "error" in res && res.error) {
      toast.error(res.error);
    } else {
      toast.success(`Unassigned from ${classroomName}`);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        nativeButton={!trigger}
        render={
          trigger ? (
            (trigger as any)
          ) : (
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Details</span>
            </Button>
          )
        }
      />

      <DrawerContent side="right" className="w-full max-w-xl sm:max-w-2xl h-full flex flex-col p-0">
        {/* Drawer Header */}
        <DrawerHeader className="p-6 border-b shrink-0 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                {scenario.missionData ? (
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    <Sparkles className="h-3 w-3 mr-1 text-primary" /> Civic Mission
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    Standard Scenario
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  Created {format(new Date(scenario.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <DrawerTitle className="text-2xl font-extrabold tracking-tight">
                {scenario.title}
              </DrawerTitle>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/admin/dashboard/scenarios/${scenario.id}/edit`}>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Button>
              </Link>
              <AssignScenarioDialog
                scenarioId={scenario.id}
                scenarioTitle={scenario.title}
                classrooms={classrooms}
                assignedClassroomIds={assignedClassroomIds}
              />
            </div>
          </div>
        </DrawerHeader>

        {/* 4-Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 border-b bg-card shrink-0">
            <TabsList className="h-11 bg-transparent p-0 gap-6 border-b-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-1 pb-3 text-xs font-semibold gap-1.5"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Overview & Criteria</span>
              </TabsTrigger>

              <TabsTrigger
                value="classrooms"
                className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-1 pb-3 text-xs font-semibold gap-1.5"
              >
                <School className="h-3.5 w-3.5" />
                <span>Classrooms</span>
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-4">
                  {assignedClassrooms.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="mission"
                className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-1 pb-3 text-xs font-semibold gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Mission Structure</span>
              </TabsTrigger>

              <TabsTrigger
                value="submissions"
                className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-1 pb-3 text-xs font-semibold gap-1.5"
              >
                <Award className="h-3.5 w-3.5" />
                <span>Submissions</span>
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-4">
                  {scenarioSubmissions.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* TAB 1: OVERVIEW & CONSTRAINTS */}
            <TabsContent value="overview" className="space-y-6 m-0 focus:outline-none">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description & Context
                </h4>
                <p className="text-sm text-foreground leading-relaxed bg-muted/20 p-4 rounded-xl border">
                  {scenario.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ListChecks className="h-3.5 w-3.5 text-primary" />
                  Scenario Constraints & Evaluation Rules
                </h4>

                {scenario.constraints.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No constraints configured for this scenario.</p>
                ) : (
                  <div className="space-y-2">
                    {scenario.constraints.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg border bg-card text-xs flex items-start gap-2.5 shadow-2xs"
                      >
                        <span className="h-5 w-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {i + 1}
                        </span>
                        <span className="text-foreground leading-snug pt-0.5">{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 2: ASSIGNED CLASSROOMS */}
            <TabsContent value="classrooms" className="space-y-4 m-0 focus:outline-none">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Classroom Sections</h4>
                  <p className="text-xs text-muted-foreground">
                    Classrooms where students are currently assigned this scenario.
                  </p>
                </div>
                <AssignScenarioDialog
                  scenarioId={scenario.id}
                  scenarioTitle={scenario.title}
                  classrooms={classrooms}
                  assignedClassroomIds={assignedClassroomIds}
                />
              </div>

              {assignedClassrooms.length === 0 ? (
                <div className="py-12 text-center border rounded-xl border-dashed bg-muted/20 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                    <School className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 max-w-xs mx-auto">
                    <p className="text-sm font-semibold">Not Assigned to Any Classrooms</p>
                    <p className="text-xs text-muted-foreground">
                      Assign this civic challenge to one or more active sections so students can collaborate and submit plans.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {assignedClassrooms.map((c) => {
                    const classStudents = students.filter((s) => s.classroomId === c.id);
                    return (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl border bg-card shadow-2xs flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-sm text-foreground truncate">{c.name}</h5>
                            <Badge variant={c.status === "active" ? "default" : "secondary"} className="text-[10px]">
                              {c.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Join Code: <strong className="font-mono text-foreground">{c.code}</strong></span>
                            <span>•</span>
                            <span>{classStudents.length} Students</span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleUnassign(c.id, c.name)}
                          title="Unassign from classroom"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* TAB 3: MISSION STRUCTURE */}
            <TabsContent value="mission" className="space-y-4 m-0 focus:outline-none">
              {!scenario.missionData ? (
                <div className="py-12 text-center border rounded-xl border-dashed bg-muted/20 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 max-w-xs mx-auto">
                    <p className="text-sm font-semibold">Standard Mission</p>
                    <p className="text-xs text-muted-foreground">
                      This scenario uses standard simulation criteria. You can edit it to add structured problem categories, evidence banks, and stakeholder roles.
                    </p>
                  </div>
                  <Link href={`/admin/dashboard/scenarios/${scenario.id}/edit`}>
                    <Button size="sm" variant="outline" className="text-xs mt-2">
                      Configure Mission Structure
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {/* Issues / Root Causes */}
                  {scenario.missionData.issues && (
                    <div className="p-4 rounded-xl border bg-card space-y-2">
                      <h5 className="font-bold text-foreground flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-primary" />
                        Root Causes & Issues Bank ({scenario.missionData.issues.length})
                      </h5>
                      <div className="space-y-1.5 text-muted-foreground">
                        {scenario.missionData.issues.map((issue, i) => (
                          <div key={i} className="p-2 rounded bg-muted/30 border">
                            <span className="font-semibold text-foreground">Issue {i + 1}: </span>
                            <span>{typeof issue === "string" ? issue : (issue as any)?.title || (issue as any)?.description || JSON.stringify(issue)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stakeholders */}
                  {scenario.missionData.stakeholders && (
                    <div className="p-4 rounded-xl border bg-card space-y-2">
                      <h5 className="font-bold text-foreground flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        Community Stakeholders ({scenario.missionData.stakeholders.length})
                      </h5>
                      <div className="grid sm:grid-cols-2 gap-2 text-muted-foreground">
                        {scenario.missionData.stakeholders.map((stk, i) => (
                          <div key={i} className="p-2.5 rounded bg-muted/30 border space-y-0.5">
                            <p className="font-semibold text-foreground">{stk.name || `Stakeholder ${i + 1}`}</p>
                            <p className="text-[11px] text-muted-foreground">{stk.role || stk.initialStatement || "Community perspective"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step Guidance Tips */}
                  {scenario.missionData.stepTips && (
                    <div className="p-4 rounded-xl border bg-card space-y-2">
                      <h5 className="font-bold text-foreground flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-primary" />
                        Step Guidance & Instructor Tips
                      </h5>
                      <div className="space-y-1.5 text-muted-foreground">
                        {Object.entries(scenario.missionData.stepTips).map(([stepKey, tip]) => (
                          <div key={stepKey} className="p-2 rounded bg-muted/30 border flex items-start gap-2">
                            <Badge variant="outline" className="text-[9px] uppercase shrink-0">
                              Step {stepKey}
                            </Badge>
                            <span className="text-[11px] text-foreground">{String(tip)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* TAB 4: SUBMISSIONS AUDIT */}
            <TabsContent value="submissions" className="space-y-4 m-0 focus:outline-none">
              {scenarioSubmissions.length === 0 ? (
                <div className="py-12 text-center border rounded-xl border-dashed bg-muted/20 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 max-w-xs mx-auto">
                    <p className="text-sm font-semibold">No Submissions Yet</p>
                    <p className="text-xs text-muted-foreground">
                      Student action plans and evaluations for this scenario will appear here once submitted.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {scenarioSubmissions.map(({ sub, student, classroom }) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl border bg-card shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Badge variant={sub.status === "completed" ? "default" : "secondary"} className="text-[10px]">
                            {sub.status.toUpperCase()}
                          </Badge>
                          {typeof sub.score === "number" && (
                            <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/30">
                              Score: {sub.score}
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {format(new Date(sub.submittedAt), "MMM d, yyyy • h:mm a")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <div>
                          <p className="font-semibold text-foreground">{student?.fullName || "Student"}</p>
                          <p className="text-muted-foreground font-mono text-[11px]">{student?.lrn}</p>
                        </div>
                        {classroom && (
                          <Badge variant="secondary" className="text-[10px]">
                            {classroom.name}
                          </Badge>
                        )}
                      </div>

                      {sub.feedback && (
                        <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-md border italic mt-2">
                          "{sub.feedback}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}
