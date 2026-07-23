import { readData, DataFileType } from "@/lib/db";
import { Classroom, Scenario, Student, Submission } from "@/lib/definitions";
import { SubmissionsView } from "./submissions-view";

export default async function SubmissionsPage() {
  const submissions = readData<Submission>(DataFileType.Submissions);
  const students = readData<Student>(DataFileType.Students);
  const scenarios = readData<Scenario>(DataFileType.Scenarios);
  const classrooms = readData<Classroom>(DataFileType.Classrooms);

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
