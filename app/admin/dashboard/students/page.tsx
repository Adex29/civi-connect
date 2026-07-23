import { getAllStudents, getAllClassrooms, getAllGroups } from "@/lib/db";
import { Classroom, Student, Group } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function StudentsPage() {
  const students = await getAllStudents();
  const classrooms = await getAllClassrooms();
  const groups = await getAllGroups();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Students Directory</h2>
        <p className="text-muted-foreground">
          View all students registered across all classrooms.
        </p>
      </div>
      
      <div className="grid gap-4">
        {classrooms.map((classroom: Classroom) => {
          const classStudents = students.filter((s: Student) => s.classroomId === classroom.id);
          
          if (classStudents.length === 0) return null;

          return (
            <Card key={classroom.id}>
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 pb-4">
                <CardTitle className="text-xl flex items-center justify-between">
                  <span>{classroom.name} ({classroom.code})</span>
                  <Badge variant="secondary">{classStudents.length} Students</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-md">LRN</th>
                        <th className="px-4 py-3">Full Name</th>
                        <th className="px-4 py-3">Group</th>
                        <th className="px-4 py-3 rounded-tr-md">Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStudents.map((student: Student) => {
                        const group = groups.find((g: Group) => g.id === student.groupId);
                        return (
                          <tr key={student.id} className="border-b last:border-0 dark:border-slate-800">
                            <td className="px-4 py-3 font-mono">{student.lrn}</td>
                            <td className="px-4 py-3 font-medium">{student.fullName}</td>
                            <td className="px-4 py-3">
                              {group ? (
                                <Badge variant="outline">{group.name}</Badge>
                              ) : (
                                <span className="text-muted-foreground italic text-xs">Individual</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {format(new Date(student.createdAt), "MMM d, yyyy")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {students.length === 0 && (
          <div className="py-12 text-center border rounded-lg border-dashed">
            <h3 className="text-lg font-medium">No students registered</h3>
            <p className="text-sm text-muted-foreground mt-1">Share classroom codes with students to have them register.</p>
          </div>
        )}
      </div>
    </div>
  );
}
