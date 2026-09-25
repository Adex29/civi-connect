import { getCurrentStudent } from "@/lib/dal";
import {
  findScenarioById,
  findSubmissionForStudent,
  findClassroomById,
  findClassroomScenario,
} from "@/lib/db";
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

  // Execute targeted indexed queries in parallel
  const [scenario, submission, classroom, assignment] = await Promise.all([
    findScenarioById(scenarioId),
    findSubmissionForStudent(scenarioId, student.id, student.groupId),
    findClassroomById(student.classroomId),
    findClassroomScenario(student.classroomId, scenarioId),
  ]);

  if (!scenario) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="p-12 text-center border border-dashed rounded-lg bg-muted/40">
          <h2 className="text-xl font-bold">Mission No Longer Available</h2>
          <p className="text-sm text-muted-foreground mt-2">
            This mission has been removed or is no longer assigned to your classroom.
          </p>
        </div>
      </div>
    );
  }

  const isCompleted = submission?.status === "completed";

  // Check if scenario itself is archived
  const isScenarioArchived = scenario.status === "archived";

  // If scenario is archived and not completed by student, block with helpful banner
  if (isScenarioArchived && !isCompleted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="p-12 text-center border border-dashed rounded-lg bg-muted/40">
          <h2 className="text-xl font-bold">Mission Archived</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            This civic mission has been archived by the administrator. Unfinished simulations and new submissions are no longer accepted.
          </p>
        </div>
      </div>
    );
  }

  // If unassigned or classroom missing: allow read-only access if student completed it, otherwise redirect
  if (!classroom || !assignment || !assignment.isActive) {
    if (!isCompleted) {
      redirect("/dashboard");
    }
  }

  const isArchived = (classroom ? classroom.status === "archived" : true) || isScenarioArchived || !assignment?.isActive;

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
        isArchived={isArchived}
      />
    </div>
  );
}
