import { getCurrentStudent } from "@/lib/dal";
import { getAllClassrooms, getAllClassroomScenarios, getAllScenarios, getAllSubmissions } from "@/lib/db";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CivicCompanion } from "@/components/civic-companion";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Archive,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  ListOrdered,
  FileCheck,
  Users,
  Lightbulb,
  Zap,
  RefreshCw,
  Target,
  GraduationCap,
  Layers,
  Award,
} from "lucide-react";

export default async function StudentDashboard() {
  const student = await getCurrentStudent();
  if (!student) return null;

  const classrooms = await getAllClassrooms();
  const classroom = classrooms.find((c) => c.id === student.classroomId);
  const isArchived = classroom?.status === "archived";

  const allClassroomScenarios = await getAllClassroomScenarios();
  const classroomScenarios = allClassroomScenarios.filter((cs) => cs.classroomId === student.classroomId);

  const allScenarios = await getAllScenarios();

  // Get scenarios assigned to this student's classroom (excluding archived scenarios)
  const assignedScenarios = classroomScenarios
    .map((cs) => {
      const scenario = allScenarios.find((s) => s.id === cs.scenarioId);
      if (!scenario) return null;
      return { ...scenario, active: cs.isActive };
    })
    .filter((s): s is NonNullable<typeof s> => Boolean(s && s.id && s.active && s.status !== "archived"));

  const allSubmissions = await getAllSubmissions();
  const submissions = allSubmissions.filter(
    (s) => s.studentId === student.id || (student.groupId && s.groupId === student.groupId)
  );

  // Derived metrics from existing data
  const completedMissionsCount = submissions.filter((s) => s.status === "completed").length;
  const inProgressMissionsCount = submissions.filter((s) => s.status !== "completed").length;
  const classroomName = classroom?.name || "Civic Engagement";

  const roadmapSteps = [
    {
      num: "01",
      phase: "Phase 1: Investigation",
      name: "Identify Community Issues",
      desc: "Recognize and define the most pressing community problem.",
      icon: Search,
    },
    {
      num: "02",
      phase: "Phase 1: Investigation",
      name: "Analyze Causes",
      desc: "Examine the root causes and contributing factors.",
      icon: ListOrdered,
    },
    {
      num: "03",
      phase: "Phase 1: Investigation",
      name: "Evaluate Digital Evidence",
      desc: "Assess the credibility, relevance, and reliability of different digital sources before making decisions.",
      icon: FileCheck,
    },
    {
      num: "04",
      phase: "Phase 2: Consultation",
      name: "Consult Simulated Stakeholders",
      desc: "Gather insights from community members, local leaders, and organizations through realistic simulations.",
      icon: Users,
    },
    {
      num: "05",
      phase: "Phase 2: Consultation",
      name: "Develop an Intervention Plan",
      desc: "Create practical, evidence-based solutions for the identified community issue.",
      icon: Lightbulb,
    },
    {
      num: "06",
      phase: "Phase 3: Adaptive Refinement",
      name: "Anticipate Challenges",
      desc: "Respond to unexpected obstacles and revise your plan accordingly.",
      icon: Zap,
    },
    {
      num: "07",
      phase: "Phase 3: Adaptive Refinement",
      name: "Revise Plan",
      desc: "Refine and adapt your intervention plan based on the simulation obstacle.",
      icon: RefreshCw,
    },
    {
      num: "08",
      phase: "Phase 3: Adaptive Refinement",
      name: "Assess Community Impact",
      desc: "Evaluate the feasibility, sustainability, effectiveness, and ethical implications of your proposed solution.",
      icon: Target,
    },
  ];

  return (
    <div className="space-y-10">
      {/* ========================================================================= */}
      {/* 1. HERO WELCOME COMMAND CENTER (With Original Mascot Graphic)            */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card/95 to-primary/[0.04] p-6 shadow-sm sm:p-8 lg:p-10">
        {/* Soft Ambient Glow Halo in Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-1/4 size-64 rounded-full bg-secondary/10 blur-3xl"
        />

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
          {/* Left Column: Welcome Heading, Mission Statement & Quick Civic Status */}
          <div className="space-y-5 lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5 text-secondary" />
              <span>Senior High School Citizenship Simulation</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Welcome, <span className="text-primary">{student.fullName}</span>!
              </h1>
              <p className="max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
                Be ready to think critically, analyze evidence, collaborate with stakeholders, create sustainable solutions, and become an active and responsible citizen.
              </p>
            </div>

            {/* Quick Civic Status Badge Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3.5 py-2 text-xs font-semibold text-foreground">
                <GraduationCap className="size-4 text-primary" />
                <span>Classroom: <strong className="text-foreground">{classroomName}</strong></span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3.5 py-2 text-xs font-semibold text-foreground">
                <Layers className="size-4 text-secondary" />
                <span>Active Missions: <strong className="text-foreground">{assignedScenarios.length}</strong></span>
              </div>
              {completedMissionsCount > 0 && (
                <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <Award className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Completed: <strong>{completedMissionsCount}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Living Civic Companion ("Civi" - Interactive Vector Mascot) */}
          <div className="relative flex items-center justify-center lg:col-span-4 self-center">
            <CivicCompanion studentName={student.fullName} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CLASSROOM STATUS ALERTS                                                */}
      {/* ========================================================================= */}
      {!classroom && (
        <div className="flex items-start gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-xs">
          <AlertTriangle className="mt-0.5 size-6 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <h3 className="font-bold text-amber-900 dark:text-amber-200">Classroom Unavailable</h3>
            <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-300/80">
              Your assigned classroom is no longer available. Please contact your instructor.
            </p>
          </div>
        </div>
      )}

      {isArchived && (
        <div className="flex items-start gap-4 rounded-xl border border-slate-500/30 bg-slate-500/10 p-5 shadow-xs">
          <Archive className="mt-0.5 size-6 shrink-0 text-slate-600 dark:text-slate-400" />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-200">Classroom Archived</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              This classroom has been archived by your instructor. Missions are in read-only mode.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WHAT YOU WILL DO IN CIVI-TECH (8-Stage Simulation Pathway)             */}
      {/* ========================================================================= */}
      <Card className="overflow-hidden border-border/80 bg-card/90 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2.5 text-lg font-bold">
              <ShieldCheck className="size-5 text-primary" />
              <span>What You Will Do in Civi-Tech</span>
            </CardTitle>
            <span className="text-xs font-semibold text-muted-foreground">
              8 Core Simulation Phases
            </span>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Complete the 8 simulation phases to develop evidence-based civic action plans.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
            {roadmapSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:bg-muted/30 hover:shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        {step.num}
                      </span>
                      <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-snug text-foreground">
                        {step.name}
                      </h4>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground line-clamp-3">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 4. AVAILABLE CIVIC MISSIONS (Rich Action Dossiers)                        */}
      {/* ========================================================================= */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            <BookOpen className="size-5 text-primary" />
            <span>Available Civic Missions</span>
          </h2>
          {assignedScenarios.length > 0 && (
            <span className="text-xs font-semibold text-muted-foreground">
              {assignedScenarios.length} {assignedScenarios.length === 1 ? "Mission" : "Missions"} Assigned
            </span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignedScenarios.length > 0 ? (
            assignedScenarios.map((scenario) => {
              if (!scenario) return null;

              const submission = submissions.find((s) => s.scenarioId === scenario.id);
              const isCompleted = submission?.status === "completed";
              const currentStep = submission?.simulationState?.currentStep || 1;
              const progressPct = isCompleted
                ? 100
                : !submission || currentStep <= 1
                ? 0
                : Math.min(Math.round(((currentStep - 1) / 8) * 100), 95);

              return (
                <Card
                  key={scenario.id}
                  className="group relative flex h-full flex-col overflow-hidden border-border/80 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                >
                  {/* Thematic Top Accent Bar */}
                  {/* <div
                    className={`h-1.5 w-full ${
                      isCompleted
                        ? "bg-emerald-500"
                        : submission
                        ? "bg-amber-500"
                        : "bg-primary"
                    }`}
                  /> */}

                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base font-bold leading-snug text-foreground line-clamp-2 sm:text-lg">
                        {scenario.title}
                      </CardTitle>
                      {isCompleted ? (
                        <Badge className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-[10px]">
                          <CheckCircle2 className="size-3" />
                          <span>Completed</span>
                        </Badge>
                      ) : submission ? (
                        <Badge variant="secondary" className="shrink-0 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30 gap-1 text-[10px]">
                          <Clock className="size-3" />
                          <span>Step {Math.min(currentStep, 8)}/8</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="shrink-0 border-primary/30 text-primary font-bold gap-1 text-[10px]">
                          <Sparkles className="size-3" />
                          <span>New Mission</span>
                        </Badge>
                      )}
                    </div>

                    <CardDescription className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {scenario.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow space-y-4 pt-2">
                    {/* Segmented 8-Step Simulation Visualizer */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Mission Progress</span>
                        <span className="font-mono text-primary">{progressPct}%</span>
                      </div>

                      {/* 8 Discrete Step Segments */}
                      <div className="grid grid-cols-8 gap-1">
                        {Array.from({ length: 8 }, (_, i) => {
                          const stepNum = i + 1;
                          const isPastOrCurrent = isCompleted || (submission && stepNum < currentStep);
                          const isCurrent = !isCompleted && submission && stepNum === currentStep;

                          return (
                            <div
                              key={stepNum}
                              title={`Step ${stepNum}`}
                              className={`h-2 rounded-xs transition-all duration-300 ${
                                isCompleted
                                  ? "bg-emerald-500"
                                  : isCurrent
                                  ? "bg-amber-500 animate-pulse"
                                  : isPastOrCurrent
                                  ? "bg-primary"
                                  : "bg-muted"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-border/60 bg-muted/10 pt-3">
                    <Link
                      href={`/dashboard/activity/${scenario.id}`}
                      className={buttonVariants({
                        variant: isCompleted || isArchived ? "outline" : "default",
                        className: `w-full gap-2 font-bold text-xs sm:text-sm ${
                          !isCompleted && !isArchived ? "shadow-xs" : ""
                        }`,
                      })}
                    >
                      <span>
                        {isArchived
                          ? isCompleted
                            ? "View Performance (Read-Only)"
                            : "View Progress (Read-Only)"
                          : isCompleted
                          ? "View Performance"
                          : submission
                          ? "Continue Mission"
                          : "Start Simulation"}
                      </span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            /* Empty State with Original Civic Simulation Art */
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
              <Image
                src="/images/civic-mission-concept.png"
                alt="Civic simulation tablet"
                width={180}
                height={180}
                className="mb-4 size-32 object-contain opacity-90 drop-shadow-sm"
              />
              <h3 className="text-lg font-bold text-foreground">No Missions Assigned Yet</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Your teacher hasn&apos;t assigned any civic missions to your classroom yet. Check back later!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. RECENT ACTIVITY LIST                                                  */}
      {/* ========================================================================= */}
      {submissions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Your Recent Activity
            </h2>
            <span className="text-xs text-muted-foreground">
              {submissions.length} {submissions.length === 1 ? "Record" : "Records"}
            </span>
          </div>

          <div className="space-y-3">
            {submissions.map((sub) => {
              const scenario = allScenarios.find((s) => s.id === sub.scenarioId);
              const score = sub.score || sub.simulationState?.scores?.overallScore;
              const isCompleted = sub.status === "completed";
              const isMissionArchived = scenario?.status === "archived" || isArchived;

              return (
                <Card
                  key={sub.id}
                  className="border-border/70 bg-card transition-colors hover:border-primary/30"
                >
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                          isCompleted
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="size-5" />
                        ) : (
                          <Clock className="size-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground">
                            {scenario?.title || "Civic Mission"}
                          </p>
                          {isMissionArchived && (
                            <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-[10px] font-bold px-1.5 py-0 h-4">
                              Archived
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Status:{" "}
                          <span className="font-medium capitalize text-foreground">
                            {sub.status.replace("_", " ")}
                          </span>{" "}
                          • Score:{" "}
                          <strong className="text-primary font-mono">
                            {score ? `${score}%` : "In Progress"}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/activity/${sub.scenarioId}`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                        className: "self-end sm:self-auto font-bold text-xs gap-1.5",
                      })}
                    >
                      <span>Open</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
