"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Users, BookOpen, Key, GraduationCap, Copy, Check } from "lucide-react";
import { Classroom, Student, Scenario } from "@/lib/definitions";
import { toast } from "sonner";

export function ClassroomRosterDrawer({
  classroom,
  students,
  scenarios,
}: {
  classroom: Classroom;
  students: Student[];
  scenarios: Scenario[];
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const classroomStudents = students.filter((s) => s.classroomId === classroom.id);

  const copyCode = () => {
    navigator.clipboard.writeText(classroom.code);
    setCopied(true);
    toast.success("Join code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button variant="outline" size="sm" className="w-full gap-1.5 mt-2">
            <Users className="h-4 w-4" />
            View Details
          </Button>
        }
      />
      <DrawerContent side="right" className="w-full max-w-lg sm:max-w-xl">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <Badge variant={classroom.status === "active" ? "default" : "secondary"}>
              {classroom.status.toUpperCase()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={copyCode}
              className="gap-1.5 text-xs font-mono"
            >
              {/* <Key className="h-3.5 w-3.5 text-muted-foreground" /> */}
              Code: <span className="font-bold">{classroom.code}</span>
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
          <DrawerTitle className="text-2xl mt-2">{classroom.name}</DrawerTitle>
          <DrawerDescription>
            {classroom.description || "Classroom details, student roster, and assigned scenarios."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto p-4 space-y-6 flex-1 text-sm">
          {/* Enrolled Students */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-primary" /> Enrolled Students ({classroomStudents.length})
              </h4>
            </div>

            {classroomStudents.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-4 text-center border rounded-md">
                No students enrolled in this classroom yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {classroomStudents.map((st) => (
                  <div
                    key={st.id}
                    className="flex justify-between items-center p-2.5 rounded-md border bg-muted/40 text-xs"
                  >
                    <div>
                      <span className="font-medium text-foreground">{st.fullName}</span>
                      <span className="text-muted-foreground ml-2 font-mono">({st.lrn})</span>
                    </div>
                    {st.groupId ? (
                      <Badge variant="outline" className="text-xs">
                        Group {st.groupId}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">No group</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Scenarios */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" /> Assigned Scenarios ({scenarios.length})
            </h4>

            {scenarios.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-4 text-center border rounded-md">
                No scenarios assigned to this classroom yet.
              </p>
            ) : (
              <div className="space-y-2">
                {scenarios.map((sc) => (
                  <div
                    key={sc.id}
                    className="p-3 rounded-md border bg-card text-xs space-y-1"
                  >
                    <p className="font-semibold text-foreground text-sm">{sc.title}</p>
                    <p className="text-muted-foreground line-clamp-2">{sc.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DrawerFooter className="border-t pt-4">
          <DrawerClose
            render={
              <Button variant="outline" className="w-full">
                Close
              </Button>
            }
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
