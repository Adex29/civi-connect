import { getCurrentStudent } from "@/lib/dal";
import { readData, DataFileType } from "@/lib/db";
import { Classroom, ClassroomScenario, Scenario, Submission } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, CheckCircle, Clock, Archive, AlertTriangle } from "lucide-react";

export default async function StudentDashboard() {
  const student = await getCurrentStudent();
  if (!student) return null;

  const classrooms = readData<Classroom>(DataFileType.Classrooms);
  const classroom = classrooms.find(c => c.id === student.classroomId);
  const isArchived = classroom?.status === "archived";

  const classroomScenarios = readData<ClassroomScenario>(DataFileType.ClassroomScenarios)
    .filter(cs => cs.classroomId === student.classroomId);
    
  const allScenarios = readData<Scenario>(DataFileType.Scenarios);
  
  // Get scenarios assigned to this student's classroom
  const assignedScenarios = classroomScenarios.map(cs => {
    const scenario = allScenarios.find(s => s.id === cs.scenarioId);
    return { ...scenario, active: cs.isActive };
  }).filter(s => s && s.active);

  const submissions = readData<Submission>(DataFileType.Submissions)
    .filter(s => s.studentId === student.id || (student.groupId && s.groupId === student.groupId));

  const staggerClasses = ["stagger-1", "stagger-2", "stagger-3", "stagger-4", "stagger-5", "stagger-6"];

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {student.fullName}</h1>
        <p className="text-muted-foreground mt-2">
          Select a scenario below to start planning your civic action.
        </p>
      </div>

      {!classroom && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-5 flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
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
        <div className="rounded-xl bg-slate-500/10 border border-slate-500/20 p-5 flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <Archive className="h-6 w-6 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-200">Classroom Archived</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              This classroom has been archived by your instructor. Scenarios are in read-only mode.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignedScenarios.length > 0 ? (
          assignedScenarios.map((scenario, index) => {
            if (!scenario) return null;
            
            const submission = submissions.find(s => s.scenarioId === scenario.id);
            const isCompleted = submission?.status === "completed";
            
            return (
              <Card
                key={scenario.id}
                className={`flex flex-col h-full animate-fade-in-up ${staggerClasses[index % staggerClasses.length]} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl line-clamp-2">{scenario.title}</CardTitle>
                    {isCompleted ? (
                      <Badge className="bg-emerald-600 hover:bg-emerald-700">Completed</Badge>
                    ) : submission ? (
                      <Badge variant="secondary">In Progress</Badge>
                    ) : (
                      <Badge variant="outline">New</Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-3 mt-2">
                    {scenario.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {scenario.constraints?.length || 0} Requirements
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t">
                  <Link href={`/dashboard/activity/${scenario.id}`} className={buttonVariants({ variant: isCompleted ? "outline" : "default", className: "w-full" })}>
                    {isCompleted ? "View Submission" : submission ? "Continue Planning" : "Start Planning"}
                  </Link>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/40 animate-fade-in">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">No Scenarios Assigned</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
              Your teacher hasn't assigned any civic scenarios to your classroom yet. Check back later!
            </p>
          </div>
        )}
      </div>
      
      {submissions.length > 0 && (
        <div className="mt-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Your Recent Activity</h2>
          <div className="space-y-4">
            {submissions.map((sub, index) => {
              const scenario = allScenarios.find(s => s.id === sub.scenarioId);
              return (
                <Card
                  key={sub.id}
                  className={`bg-card animate-fade-in-up ${staggerClasses[index % staggerClasses.length]} hover:shadow-md transition-shadow duration-200`}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${sub.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {sub.status === 'completed' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{scenario?.title || 'Unknown Scenario'}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {sub.status} • Score: {sub.score ?? 'Pending'}
                        </p>
                      </div>
                    </div>
                    <Link href={`/dashboard/activity/${sub.scenarioId}`} className={buttonVariants({ variant: "ghost" })}>
                      View
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
