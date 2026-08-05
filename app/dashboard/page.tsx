import { getCurrentStudent } from "@/lib/dal";
import { getAllClassrooms, getAllClassroomScenarios, getAllScenarios, getAllSubmissions } from "@/lib/db";
import { Classroom, ClassroomScenario, Scenario, Submission } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
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
  Target,
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

  // Get scenarios assigned to this student's classroom
  const assignedScenarios = classroomScenarios
    .map((cs) => {
      const scenario = allScenarios.find((s) => s.id === cs.scenarioId);
      return { ...scenario, active: cs.isActive };
    })
    .filter((s) => s && s.active);

  const allSubmissions = await getAllSubmissions();
  const submissions = allSubmissions.filter(
    (s) => s.studentId === student.id || (student.groupId && s.groupId === student.groupId)
  );

  const roadmapSteps = [
    { num: 1, name: "Identify Issues", desc: "Define priority community problems", icon: Search },
    { num: 2, name: "Analyze Causes", desc: "Examine root causes & contributing factors", icon: ListOrdered },
    { num: 3, name: "Evaluate Evidence", desc: "Assess source credibility & reliability", icon: FileCheck },
    { num: 4, name: "Consult Stakeholders", desc: "Interview community leaders & residents", icon: Users },
    { num: 5, name: "Develop Plan", desc: "Create actionable, evidence-based solutions", icon: Lightbulb },
    { num: 6, name: "Anticipate Challenges", desc: "Respond to unexpected budget/resource shifts", icon: Zap },
    { num: 7, name: "Assess Impact", desc: "Evaluate feasibility, ethics & long-term impact", icon: Target },
  ];

  return (
    <div className="space-y-8">
      {/* Banner Card - PDF Page 2 */}
      <Card className="border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background shadow-md overflow-hidden animate-fade-in-up">
        <CardContent className="p-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
            <Sparkles className="h-3.5 w-3.5" /> Senior High School Citizenship Simulation
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome, {student.fullName}!
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed italic">
            Be ready to think critically, analyze evidence, collaborate with stakeholders, create sustainable solutions, and become an active and responsible citizen.
          </p>
        </CardContent>
      </Card>

      {/* Classroom Status Banners */}
      {!classroom && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-5 flex items-start gap-4 animate-fade-in-up">
          <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-200">Classroom Unavailable</h3>
            <p className="text-sm text-amber-800/80 dark:text-amber-300/80 mt-1">
              Your assigned classroom is no longer available. Please contact your instructor.
            </p>
          </div>
        </div>
      )}

      {isArchived && (
        <div className="rounded-xl bg-slate-500/10 border border-slate-500/20 p-5 flex items-start gap-4 animate-fade-in-up">
          <Archive className="h-6 w-6 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-200">Classroom Archived</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              This classroom has been archived by your instructor. Scenarios are in read-only mode.
            </p>
          </div>
        </div>
      )}

      {/* "What You Will Do?" Roadmap Card - PDF Page 3 */}
      <Card className="border shadow-sm bg-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> What You Will Do in Civi-Tech
          </CardTitle>
          <CardDescription className="text-xs">
            Complete the 7 simulation phases to develop evidence-based civic action plans.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {roadmapSteps.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors space-y-1.5 text-center flex flex-col items-center justify-center"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {step.num}
                  </div>
                  <h4 className="font-bold text-xs leading-snug">{step.name}</h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Missions / Scenarios Grid */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" /> Available Civic Missions
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignedScenarios.length > 0 ? (
            assignedScenarios.map((scenario) => {
              if (!scenario) return null;

              const submission = submissions.find((s) => s.scenarioId === scenario.id);
              const isCompleted = submission?.status === "completed";
              const currentStep = submission?.simulationState?.currentStep || 1;
              const progressPct = isCompleted ? 100 : Math.round((Math.min(currentStep, 7) / 7) * 100);

              return (
                <Card
                  key={scenario.id}
                  className="flex flex-col h-full hover:shadow-md hover:-translate-y-1 transition-all duration-200 border"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg font-bold line-clamp-2">{scenario.title}</CardTitle>
                      {isCompleted ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700">Completed</Badge>
                      ) : submission ? (
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 font-bold">
                          Step {Math.min(currentStep, 7)}/7
                        </Badge>
                      ) : (
                        <Badge variant="outline">New Mission</Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-3 mt-2 text-xs">
                      {scenario.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Mission Progress</span>
                        <span className="text-primary font-mono">{progressPct}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isCompleted ? "bg-emerald-500" : "bg-primary"
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t">
                    <Link
                      href={`/dashboard/activity/${scenario.id}`}
                      className={buttonVariants({
                        variant: isCompleted ? "outline" : "default",
                        className: "w-full gap-2 font-bold",
                      })}
                    >
                      {isCompleted
                        ? "View Performance"
                        : submission
                        ? "Continue Mission"
                        : "Start Simulation"}{" "}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/40">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No Missions Assigned Yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                Your teacher hasn't assigned any civic scenarios to your classroom yet. Check back later!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity List */}
      {submissions.length > 0 && (
        <div className="mt-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-xl font-bold tracking-tight mb-4">Your Recent Activity</h2>
          <div className="space-y-3">
            {submissions.map((sub) => {
              const scenario = allScenarios.find((s) => s.id === sub.scenarioId);
              const score = sub.score || sub.simulationState?.scores?.overallScore;

              return (
                <Card key={sub.id} className="bg-card hover:shadow-xs transition-shadow">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          sub.status === "completed"
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                        }`}
                      >
                        {sub.status === "completed" ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{scenario?.title || "Civic Mission"}</p>
                        <p className="text-xs text-muted-foreground">
                          Status: <span className="capitalize">{sub.status.replace("_", " ")}</span> • Score:{" "}
                          <strong>{score ? `${score}%` : "In Progress"}</strong>
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/activity/${sub.scenarioId}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Open
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
