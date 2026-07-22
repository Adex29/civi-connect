import { readData, DataFileType } from "@/lib/db";
import { Classroom, Student } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateClassroomDialog } from "./create-classroom-dialog";
import { EditClassroomDialog } from "./edit-classroom-dialog";
import { DeleteClassroomDialog } from "./delete-classroom-dialog";
import { format } from "date-fns";

export default async function ClassroomsPage() {
  const classrooms = readData<Classroom>(DataFileType.Classrooms);
  const students = readData<Student>(DataFileType.Students);

  const getStudentCount = (classroomId: string) => {
    return students.filter(s => s.classroomId === classroomId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classrooms</h2>
          <p className="text-muted-foreground">
            Manage your classes, generate join codes, and view student rosters.
          </p>
        </div>
        <CreateClassroomDialog />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classrooms.map((classroom) => (
          <Card key={classroom.id} className={classroom.status === "archived" ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{classroom.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={classroom.status === "active" ? "default" : "secondary"}>
                    {classroom.status}
                  </Badge>
                  <EditClassroomDialog classroom={classroom} />
                  <DeleteClassroomDialog classroomId={classroom.id} classroomName={classroom.name} />
                </div>
              </div>
              <CardDescription>{classroom.description || "No description"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Join Code:</span>
                  <span className="font-mono font-bold">{classroom.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students:</span>
                  <span className="font-medium">{getStudentCount(classroom.id)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{format(new Date(classroom.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {classrooms.length === 0 && (
          <div className="col-span-full py-12 text-center border rounded-lg border-dashed">
            <h3 className="text-lg font-medium">No classrooms found</h3>
            <p className="text-sm text-muted-foreground mt-1">Create your first classroom to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
