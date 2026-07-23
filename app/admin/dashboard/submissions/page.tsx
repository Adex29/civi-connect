import { getAllSubmissions, getAllStudents, getAllScenarios, getAllClassrooms } from "@/lib/db";
import { Classroom, Scenario, Student, Submission } from "@/lib/definitions";
import { SubmissionsView } from "./submissions-view";

export default async function SubmissionsPage() {
  const submissions = await getAllSubmissions();
  const students = await getAllStudents();
  const scenarios = await getAllScenarios();
  const classrooms = await getAllClassrooms();

  // Sort by newest
  const sortedSubmissions = [...submissions].sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return (
    <SubmissionsView
      submissions={sortedSubmissions}
      students={students}
      scenarios={scenarios}
      classrooms={classrooms}
    />
  );
}
