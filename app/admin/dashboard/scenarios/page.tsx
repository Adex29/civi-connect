import { getAllScenarios, getAllClassrooms, getAllClassroomScenarios } from "@/lib/db";
import { Classroom, ClassroomScenario, Scenario } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CreateScenarioDialog } from "./create-scenario-dialog";
import { AssignScenarioDialog } from "./assign-scenario-dialog";
import { EditScenarioDialog } from "./edit-scenario-dialog";
import { DeleteScenarioDialog } from "./delete-scenario-dialog";
import { UnassignScenarioButton } from "./unassign-scenario-button";
import { format } from "date-fns";

export default async function ScenariosPage() {
  const scenarios = await getAllScenarios();
  const classrooms = await getAllClassrooms();
  const assignments = await getAllClassroomScenarios();

  const getAssignedClassrooms = (scenarioId: string) => {
    return assignments
      .filter((a: ClassroomScenario) => a.scenarioId === scenarioId && a.isActive)
      .map((a: ClassroomScenario) => classrooms.find((c: Classroom) => c.id === a.classroomId))
      .filter((c: Classroom | undefined): c is Classroom => Boolean(c));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scenarios Library</h2>
          <p className="text-muted-foreground">
            Create civic scenarios and assign them to your classrooms.
          </p>
        </div>
        <CreateScenarioDialog />
      </div>
      
      <div className="grid gap-6">
        {scenarios.map((scenario: Scenario) => {
          const assignedTo = getAssignedClassrooms(scenario.id);
          const assignedClassroomIds = assignedTo.map((c) => c.id);
          
          return (
            <Card key={scenario.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-xl">{scenario.title}</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {scenario.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <AssignScenarioDialog
                      scenarioId={scenario.id}
                      scenarioTitle={scenario.title}
                      classrooms={classrooms}
                      assignedClassroomIds={assignedClassroomIds}
                    />
                    <EditScenarioDialog scenario={scenario} />
                    <DeleteScenarioDialog scenarioId={scenario.id} scenarioTitle={scenario.title} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Constraints:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {scenario.constraints.map((c: string, i: number) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Assigned to:</h4>
                  {assignedTo.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {assignedTo.map((c: Classroom) => (
                        <span
                          key={c.id}
                          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200 border"
                        >
                          {c.name}
                          <UnassignScenarioButton
                            scenarioId={scenario.id}
                            classroomId={c.id}
                            classroomName={c.name}
                          />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Not assigned to any classrooms yet.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-900/50 py-3 text-xs text-muted-foreground">
                Created on {format(new Date(scenario.createdAt), "MMMM d, yyyy")}
              </CardFooter>
            </Card>
          );
        })}
        
        {scenarios.length === 0 && (
          <div className="py-12 text-center border rounded-lg border-dashed">
            <h3 className="text-lg font-medium">No scenarios found</h3>
            <p className="text-sm text-muted-foreground mt-1">Create your first scenario to build the library.</p>
          </div>
        )}
      </div>
    </div>
  );
}
