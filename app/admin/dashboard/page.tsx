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
  const [
    classrooms,
    scenarios,
    students,
    submissions,
    groups,
    classroomScenarios,
  ] = await Promise.all([
    getAllClassrooms(),
    getAllScenarios(),
    getAllStudents(),
    getAllSubmissions(),
    getAllGroups(),
    getAllClassroomScenarios(),
  ]);

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
