import { readData, DataFileType, getScenariosByClassroom } from "@/lib/db";
import { Classroom, Scenario, Student } from "@/lib/definitions";
import { ClassroomsView } from "./classrooms-view";

export default async function ClassroomsPage() {
  const classrooms = readData<Classroom>(DataFileType.Classrooms);
  const students = readData<Student>(DataFileType.Students);

  const scenariosMap: Record<string, Scenario[]> = {};
  classrooms.forEach((c) => {
    scenariosMap[c.id] = getScenariosByClassroom(c.id);
  });

  return (
    <ClassroomsView
      classrooms={classrooms}
      students={students}
      scenariosMap={scenariosMap}
    />
  );
}
