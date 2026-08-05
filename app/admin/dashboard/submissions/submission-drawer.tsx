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
import { CheckCircle, Clock, Eye, FileText, User, GraduationCap, Award, Sparkles } from "lucide-react";
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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
            <Eye className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Inspect Submission & AI Evaluation</span>
            <span className="sm:hidden">Inspect</span>
          </Button>
        }
      />
      <DrawerContent side="right" className="w-full max-w-lg sm:max-w-xl">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {submission.status === "completed" ? (
              <Badge className="bg-emerald-600 gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Completed
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3.5 w-3.5" /> In Progress
              </Badge>
            )}
            {submission.score && (
              <Badge variant="outline" className="gap-1 font-bold">
                <Award className="h-3.5 w-3.5 text-amber-500" /> Score: {submission.score}
              </Badge>
            )}
          </div>
          <DrawerTitle className="text-xl mt-2">{scenario.title}</DrawerTitle>
          <DrawerDescription>
            Submission details and AI automated evaluation log.
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

          {/* Scenario Overview */}
          <div>
            <h4 className="text-sm font-semibold mb-1 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary shrink-0" /> Scenario Description
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {scenario.description}
            </p>
          </div>

          {/* Submission Workflow Timeline Audit */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Simulation Execution Audit Timeline</h4>
            <Timeline>
              <TimelineItem>
                <TimelineDot status="completed">
                  <CheckCircle className="h-3.5 w-3.5" />
                </TimelineDot>
                <TimelineConnector />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>7-Step Simulation Start</TimelineTitle>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                  </TimelineHeader>
                  <TimelineDescription>Initiated civic engagement simulation scenario</TimelineDescription>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineDot status="completed">
                  <CheckCircle className="h-3.5 w-3.5" />
                </TimelineDot>
                <TimelineConnector />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>Intervention Plan Submitted</TimelineTitle>
                  </TimelineHeader>
                  <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap mt-1 p-3 bg-muted/20 border rounded-md">
                    {submission.content || "Plan details submitted by student"}
                  </p>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineDot status={submission.feedback ? "completed" : "current"}>
                  <CheckCircle className="h-3.5 w-3.5" />
                </TimelineDot>
                <TimelineConnector />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>AI Automated Feedback & Scoring</TimelineTitle>
                  </TimelineHeader>
                  <Alert className="bg-primary/5 border-primary/30 text-foreground mt-2">
                    <Sparkles className="h-4 w-4 text-primary shrink-0" />
                    <AlertTitle className="text-primary font-bold text-xs">
                      AI Insights & Evaluation Score
                    </AlertTitle>
                    <AlertDescription className="text-xs italic leading-relaxed mt-1">
                      "{submission.feedback || "Evaluation in progress..."}"
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
