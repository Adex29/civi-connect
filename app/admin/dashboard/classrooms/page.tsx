import { getAllClassrooms, getAllStudents, getScenariosByClassroom } from "@/lib/db";
import { Classroom, Scenario, Student } from "@/lib/definitions";
import { ClassroomsView } from "./classrooms-view";

export default async function ClassroomsPage() {
  const classrooms = await getAllClassrooms();
  const students = await getAllStudents();

  const scenariosMap: Record<string, Scenario[]> = {};
  for (const c of classrooms) {
    scenariosMap[c.id] = await getScenariosByClassroom(c.id);
  }

  return (
    <ClassroomsView
      classrooms={classrooms}
      students={students}
      scenariosMap={scenariosMap}
    />
  );
}
