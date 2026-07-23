import { getCurrentStudent } from "@/lib/dal";
import { readData, DataFileType } from "@/lib/db";
import { Scenario, Submission } from "@/lib/definitions";
import { ActivityForm } from "./activity-form";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const student = await getCurrentStudent();
  if (!student) {
    redirect("/login");
  }

  const { scenarioId } = await params;
  
  const scenarios = readData<Scenario>(DataFileType.Scenarios);
  const scenario = scenarios.find((s) => s.id === scenarioId);

  if (!scenario) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="p-12 text-center border border-dashed rounded-lg bg-muted/40">
          <h2 className="text-xl font-bold">Scenario No Longer Available</h2>
          <p className="text-sm text-muted-foreground mt-2">
            This scenario has been removed or is no longer assigned to your classroom.
          </p>
        </div>
      </div>
    );
  }

  const submissions = readData<Submission>(DataFileType.Submissions);
  const submission = submissions.find(
    (s) => s.scenarioId === scenarioId && (s.studentId === student.id || (student.groupId && s.groupId === student.groupId))
  );

  const isCompleted = submission?.status === "completed";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors animate-fade-in">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">{scenario.title}</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {scenario.description}
        </p>
      </div>

      {isCompleted ? (
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900 animate-scale-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Completed Plan</h2>
            </div>
            <div className="bg-card p-6 rounded-md border whitespace-pre-wrap font-medium">
              {submission?.content}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <ActivityForm scenario={scenario} />
        </div>
      )}
    </div>
  );
}
