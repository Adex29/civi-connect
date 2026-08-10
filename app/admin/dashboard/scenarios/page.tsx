import {
  getAllScenarios,
  getAllClassrooms,
  getAllClassroomScenarios,
  getAllSubmissions,
  getAllStudents,
} from "@/lib/db";
import { ScenariosView } from "./scenarios-view";

export default async function ScenariosPage() {
  const scenarios = await getAllScenarios();
  const classrooms = await getAllClassrooms();
  const assignments = await getAllClassroomScenarios();
  const submissions = await getAllSubmissions();
  const students = await getAllStudents();

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
