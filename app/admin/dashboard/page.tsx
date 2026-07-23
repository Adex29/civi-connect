import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllClassrooms, getAllScenarios, getAllStudents } from "@/lib/db";
import { Classroom, Scenario, Student } from "@/lib/definitions";
import { Users, BookOpen, Layers } from "lucide-react";

export default async function AdminDashboardOverview() {
  const classrooms = await getAllClassrooms();
  const scenarios = await getAllScenarios();
  const students = await getAllStudents();

  const activeClassrooms = classrooms.filter((c) => c.status === "active").length;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Welcome to the CiviConnect Admin Dashboard.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classrooms</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classrooms.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeClassrooms} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scenarios</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scenarios.length}</div>
            <p className="text-xs text-muted-foreground">
              Available in the library
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all classrooms
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
