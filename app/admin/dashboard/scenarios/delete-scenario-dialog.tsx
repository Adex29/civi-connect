"use client";

import React, { useState } from "react";
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
import { Trash2, Loader2 } from "lucide-react";
import { deleteScenarioAction } from "./actions";
import { toast } from "sonner";

export function DeleteScenarioDialog({
  scenarioId,
  scenarioTitle,
  trigger,
}: {
  scenarioId: string;
  scenarioTitle: string;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteScenarioAction(scenarioId);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Mission deleted successfully");
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
            <Button variant="destructive" size="sm" className="gap-1 text-xs">
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Mission</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold text-foreground">"{scenarioTitle}"</span> from the global library? This will also remove it from any assigned classrooms.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={loading} onClick={handleDelete}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
