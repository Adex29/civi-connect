import { getAllSubmissions, getAllStudents, getAllScenarios, getAllClassrooms } from "@/lib/db";
import { Classroom, Scenario, Student, Submission } from "@/lib/definitions";
import { SubmissionsView } from "./submissions-view";

export default async function SubmissionsPage() {
  const [submissions, students, scenarios, classrooms] = await Promise.all([
    getAllSubmissions(),
    getAllStudents(),
    getAllScenarios(),
    getAllClassrooms(),
  ]);

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
