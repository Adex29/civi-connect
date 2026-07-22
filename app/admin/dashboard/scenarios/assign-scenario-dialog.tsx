"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { assignScenarioAction } from "./actions";
import { toast } from "sonner";
import { Classroom } from "@/lib/definitions";

export function AssignScenarioDialog({ scenarioId, scenarioTitle, classrooms }: { scenarioId: string, scenarioTitle: string, classrooms: Classroom[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classroomId, setClassroomId] = useState<string | null>("");

  const activeClassrooms = classrooms.filter(c => c.status === "active");

  const handleAssign = async () => {
    if (!classroomId) {
      toast.error("Please select a classroom");
      return;
    }
    
    setLoading(true);
    const result = await assignScenarioAction(scenarioId, classroomId);
    setLoading(false);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Scenario assigned successfully");
      setOpen(false);
      setClassroomId("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="sm">
          Assign to Class
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Scenario</DialogTitle>
          <DialogDescription>
            Assign <strong>{scenarioTitle}</strong> to a classroom.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="classroom">Select Classroom</Label>
            <Select value={classroomId} onValueChange={setClassroomId}>
              <SelectTrigger>
                <span data-slot="select-value" className="flex flex-1 text-left line-clamp-1">
                  {classroomId ? (
                    (() => {
                      const c = activeClassrooms.find(x => x.id === classroomId);
                      return c ? `${c.name} (${c.code})` : "Select an active classroom";
                    })()
                  ) : (
                    <span className="text-muted-foreground">Select an active classroom</span>
                  )}
                </span>
              </SelectTrigger>
              <SelectContent>
                {activeClassrooms.length === 0 ? (
                  <SelectItem value="none" disabled>No active classrooms found</SelectItem>
                ) : (
                  activeClassrooms.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} ({c.code})</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading || !classroomId || classroomId === "none"} onClick={handleAssign}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign Scenario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
