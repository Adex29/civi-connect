import {
  getAllScenarios,
  getAllClassrooms,
  getAllClassroomScenarios,
  getAllSubmissions,
  getAllStudents,
} from "@/lib/db";
import { ScenariosView } from "./scenarios-view";

export default async function ScenariosPage() {
  const [scenarios, classrooms, assignments, submissions, students] =
    await Promise.all([
      getAllScenarios(),
      getAllClassrooms(),
      getAllClassroomScenarios(),
      getAllSubmissions(),
      getAllStudents(),
    ]);

  return (
    <ScenariosView
      scenarios={scenarios}
      classrooms={classrooms}
      assignments={assignments}
      submissions={submissions}
      students={students}
    />
  );
}
