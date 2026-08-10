"use client";

import React, { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { updateScenarioAssignmentsAction } from "./actions";
import { toast } from "sonner";
import { Classroom } from "@/lib/definitions";
import { MultiSelectCombobox, ComboboxOption } from "@/components/ui/combobox";

export function AssignScenarioDialog({
  scenarioId,
  scenarioTitle,
  classrooms,
  assignedClassroomIds = [],
  trigger,
}: {
  scenarioId: string;
  scenarioTitle: string;
  classrooms: Classroom[];
  assignedClassroomIds?: string[];
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedClassroomIds, setSelectedClassroomIds] = useState<string[]>(assignedClassroomIds);

  // Sync state whenever dialog opens or assignedClassroomIds updates
  useEffect(() => {
    if (open) {
      setSelectedClassroomIds(assignedClassroomIds);
    }
  }, [open, assignedClassroomIds]);

  const activeClassrooms = classrooms.filter((c) => c.status === "active");

  const classroomOptions: ComboboxOption[] = activeClassrooms.map((c) => ({
    value: c.id,
    label: c.name,
    sublabel: `Code: ${c.code}`,
  }));

  const handleSaveAssignments = async () => {
    setLoading(true);
    const result = await updateScenarioAssignmentsAction(scenarioId, selectedClassroomIds);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      const messages: string[] = [];
      if (result.addedCount && result.addedCount > 0) {
        messages.push(`Assigned to ${result.addedCount} classroom(s)`);
      }
      if (result.removedCount && result.removedCount > 0) {
        messages.push(`Unassigned from ${result.removedCount} classroom(s)`);
      }
      if (messages.length === 0) {
        messages.push("Classroom assignments updated");
      }
      toast.success(messages.join(" • "));
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        nativeButton={!trigger}
        render={
          trigger ? (
            (trigger as any)
          ) : (
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>Assign to Class</span>
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Manage Classroom Assignments</DialogTitle>
          <DialogDescription>
            Select classrooms to assign <strong>{scenarioTitle}</strong>. Deselect a classroom to remove its assignment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="classroom">Select Classrooms</Label>
            {activeClassrooms.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No active classrooms available.
              </p>
            ) : (
              <MultiSelectCombobox
                options={classroomOptions}
                selectedValues={selectedClassroomIds}
                onSelectChange={setSelectedClassroomIds}
                placeholder="Select active classroom(s)..."
                searchPlaceholder="Search classroom name or code..."
                emptyText="No matching active classrooms found."
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            onClick={handleSaveAssignments}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Assignments ({selectedClassroomIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
