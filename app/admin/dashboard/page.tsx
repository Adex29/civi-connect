import {
  getAllClassrooms,
  getAllScenarios,
  getAllStudents,
  getAllSubmissions,
  getAllGroups,
  getAllClassroomScenarios,
} from "@/lib/db";
import { OverviewView } from "./overview-view";

export default async function AdminDashboardOverview() {
  const classrooms = await getAllClassrooms();
  const scenarios = await getAllScenarios();
  const students = await getAllStudents();
  const submissions = await getAllSubmissions();
  const groups = await getAllGroups();
  const classroomScenarios = await getAllClassroomScenarios();

  return (
    <OverviewView
      classrooms={classrooms}
      students={students}
      scenarios={scenarios}
      submissions={submissions}
      groups={groups}
      classroomScenarios={classroomScenarios}
    />
  );
}
