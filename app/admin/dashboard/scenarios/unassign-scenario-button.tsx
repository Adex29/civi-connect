"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { unassignScenarioAction } from "./actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

export function UnassignScenarioButton({
  scenarioId,
  classroomId,
  classroomName,
}: {
  scenarioId: string;
  classroomId: string;
  classroomName: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUnassign = async () => {
    setLoading(true);
    const result = await unassignScenarioAction(scenarioId, classroomId);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Unassigned from ${classroomName}`);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            disabled={loading}
            className="ml-1 inline-flex items-center justify-center rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title={`Unassign from ${classroomName}`}
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <X className="h-3 w-3" />
            )}
          </button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unassign Mission</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to unassign this mission from{" "}
            <strong>{classroomName}</strong>? Students in this classroom will no longer access it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleUnassign();
            }}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Unassign Mission
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
