"use client";

import { useState, useMemo } from "react";
import { Classroom, Student, Scenario } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateClassroomDialog } from "./create-classroom-dialog";
import { EditClassroomDialog } from "./edit-classroom-dialog";
import { DeleteClassroomDialog } from "./delete-classroom-dialog";
import { ClassroomRosterDrawer } from "./classroom-roster-drawer";
import { format } from "date-fns";
import { Users, BookOpen, Copy, Check, School, Calendar, Plus } from "lucide-react";
import { toast } from "sonner";

interface ClassroomsViewProps {
  classrooms: Classroom[];
  students: Student[];
  scenariosMap: Record<string, Scenario[]>;
}

export function ClassroomsView({
  classrooms,
  students,
  scenariosMap,
}: ClassroomsViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getStudentCount = (classroomId: string) => {
    return students.filter((s) => s.classroomId === classroomId).length;
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Join code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stats = useMemo(() => {
    const total = classrooms.length;
    const active = classrooms.filter((c) => c.status === "active").length;
    const totalStudents = students.length;
    return { total, active, totalStudents };
  }, [classrooms, students]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classrooms</h2>
          <p className="text-muted-foreground mt-1">
            Manage your classes, generate join codes, and view student rosters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Metrics */}
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-medium mr-2">
            <span className="bg-muted px-3 py-1.5 rounded-full">
              Classes: <strong className="text-foreground">{stats.total}</strong>
            </span>
            <span className="bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
              Active: <strong>{stats.active}</strong>
            </span>
            <span className="bg-muted px-3 py-1.5 rounded-full">
              Students: <strong className="text-foreground">{stats.totalStudents}</strong>
            </span>
          </div>

          <CreateClassroomDialog />
        </div>
      </div>

      {/* Classrooms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classrooms.map((classroom) => {
          const assignedScenarios = scenariosMap[classroom.id] || [];
          const studentCount = getStudentCount(classroom.id);

          return (
            <Card 
              key={classroom.id} 
              className={`flex flex-col justify-between overflow-hidden transition-all duration-200 hover:border-primary/40 ${
                classroom.status === "archived" ? "opacity-75" : ""
              }`}
            >
              <div>
                <CardHeader className="bg-muted/40 pb-4 border-b">
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={classroom.status === "active" ? "default" : "secondary"} className="text-[10px]">
                          {classroom.status.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold pt-1">{classroom.name}</CardTitle>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <EditClassroomDialog classroom={classroom} />
                      <DeleteClassroomDialog classroomId={classroom.id} classroomName={classroom.name} />
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs mt-1">
                    {classroom.description || "No description provided."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  {/* Join Code Box */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Class Join Code</p>
                      <p className="font-mono text-base font-bold text-foreground tracking-wider">{classroom.code}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyCode(classroom.code, classroom.id)}
                      className="h-8 gap-1.5 text-xs font-medium"
                    >
                      {copiedId === classroom.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Class Stats Pills */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-md border bg-card flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                        <Users className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px]">Students</p>
                        <p className="font-semibold text-foreground">{studentCount} Enrolled</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-md border bg-card flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                        <BookOpen className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px]">Scenarios</p>
                        <p className="font-semibold text-foreground">{assignedScenarios.length} Assigned</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Created: {format(new Date(classroom.createdAt), "MMMM d, yyyy")}</span>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-2 pb-4">
                <ClassroomRosterDrawer
                  classroom={classroom}
                  students={students}
                  scenarios={assignedScenarios}
                />
              </CardFooter>
            </Card>
          );
        })}

        {classrooms.length === 0 && (
          <div className="col-span-full py-16 text-center border rounded-lg border-dashed bg-muted/30 space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <School className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-lg font-bold">No Classrooms Yet</h3>
              <p className="text-xs text-muted-foreground">
                Create your first classroom to generate join codes and assign civic scenarios to students.
              </p>
            </div>
            <div className="pt-2">
              <CreateClassroomDialog />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
