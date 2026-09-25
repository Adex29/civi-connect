import {
  getAllClassrooms,
  getAllStudents,
  getAllScenarios,
  getAllGroups,
  getAllSubmissions,
  getAllClassroomScenarios,
} from "@/lib/db";
import { Classroom, Scenario, Student, Group, Submission } from "@/lib/definitions";
import { ClassroomsView } from "./classrooms-view";

export default async function ClassroomsPage() {
  const [
    classrooms,
    students,
    allScenarios,
    allGroups,
    allSubmissions,
    allClassroomScenarios,
  ] = await Promise.all([
    getAllClassrooms(),
    getAllStudents(),
    getAllScenarios(),
    getAllGroups(),
    getAllSubmissions(),
    getAllClassroomScenarios(),
  ]);

  const scenariosMap: Record<string, Scenario[]> = {};
  for (const c of classrooms) {
    const classroomAssignments = allClassroomScenarios.filter(
      (cs) => cs.classroomId === c.id && cs.isActive
    );
    scenariosMap[c.id] = classroomAssignments
      .map((cs) => allScenarios.find((s) => s.id === cs.scenarioId))
      .filter((s): s is Scenario => Boolean(s));
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
