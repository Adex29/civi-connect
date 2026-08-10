import {
  getAllClassrooms,
  getAllStudents,
  getScenariosByClassroom,
  getAllScenarios,
  getAllGroups,
  getAllSubmissions,
} from "@/lib/db";
import { Classroom, Scenario, Student, Group, Submission } from "@/lib/definitions";
import { ClassroomsView } from "./classrooms-view";

export default async function ClassroomsPage() {
  const classrooms = await getAllClassrooms();
  const students = await getAllStudents();
  const allScenarios = await getAllScenarios();
  const allGroups = await getAllGroups();
  const allSubmissions = await getAllSubmissions();

  const scenariosMap: Record<string, Scenario[]> = {};
  for (const c of classrooms) {
    scenariosMap[c.id] = await getScenariosByClassroom(c.id);
  }

  return (
    <ClassroomsView
      classrooms={classrooms}
      students={students}
      allScenarios={allScenarios}
      scenariosMap={scenariosMap}
      groups={allGroups}
      submissions={allSubmissions}
    />
  );
}
