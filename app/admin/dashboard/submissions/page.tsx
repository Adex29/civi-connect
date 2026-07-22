import { readData, DataFileType } from "@/lib/db";
import { Classroom, Scenario, Student, Submission } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle, Clock } from "lucide-react";

export default async function SubmissionsPage() {
  const submissions = readData<Submission>(DataFileType.Submissions);
  const students = readData<Student>(DataFileType.Students);
  const scenarios = readData<Scenario>(DataFileType.Scenarios);
  const classrooms = readData<Classroom>(DataFileType.Classrooms);

  // Sort by newest
  const sortedSubmissions = [...submissions].sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Submissions Viewer</h2>
        <p className="text-muted-foreground">
          Review student civic action plans and their AI evaluation results.
        </p>
      </div>
      
      <div className="grid gap-6">
        {sortedSubmissions.map((sub: Submission) => {
          const student = students.find(s => s.id === sub.studentId);
          const scenario = scenarios.find(s => s.id === sub.scenarioId);
          const classroom = classrooms.find(c => c.id === student?.classroomId);
          
          if (!student || !scenario) return null;

          return (
            <Card key={sub.id} className="overflow-hidden">
              <div className={`h-2 w-full ${sub.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {sub.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-500" />
                      )}
                      {scenario.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Submitted by {student.fullName} ({student.lrn})
                      {student.groupId && <Badge variant="outline" className="ml-2">Group {student.groupId}</Badge>}
                      {classroom && <Badge variant="secondary" className="ml-2">{classroom.name}</Badge>}
                    </CardDescription>
                  </div>
                  <Badge variant={sub.status === 'completed' ? 'default' : 'secondary'} className={sub.status === 'completed' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>
                    {sub.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Submitted Plan:</h4>
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md border text-sm whitespace-pre-wrap font-medium">
                      {sub.content || <span className="italic text-muted-foreground">No content submitted yet.</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-900/50 py-3 text-xs text-muted-foreground flex justify-between">
                <span>Last active: {format(new Date(sub.submittedAt), "MMMM d, yyyy h:mm a")}</span>
                {sub.score && <span className="font-bold">Score: {sub.score}</span>}
              </CardFooter>
            </Card>
          );
        })}

        {submissions.length === 0 && (
          <div className="py-12 text-center border rounded-lg border-dashed">
            <h3 className="text-lg font-medium">No submissions yet</h3>
            <p className="text-sm text-muted-foreground mt-1">When students start working on scenarios, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
