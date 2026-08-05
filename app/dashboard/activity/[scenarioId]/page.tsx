import { getCurrentStudent } from "@/lib/dal";
import { findScenarioById, getAllSubmissions } from "@/lib/db";
import { ActivityForm } from "./activity-form";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
  const scenario = await findScenarioById(scenarioId);

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

  const submissions = await getAllSubmissions();
  const submission = submissions.find(
    (s) => s.scenarioId === scenarioId && (s.studentId === student.id || (student.groupId && s.groupId === student.groupId))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <ActivityForm
        scenario={scenario}
        studentName={student.fullName}
        existingSubmission={submission}
      />
    </div>
  );
}
