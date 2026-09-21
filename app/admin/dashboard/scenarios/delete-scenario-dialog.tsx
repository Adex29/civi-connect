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
  open: propOpen,
  onOpenChange: propOnOpenChange,
}: {
  scenarioId: string;
  scenarioTitle: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = propOpen !== undefined;
  const open = isControlled ? propOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (!isControlled) setInternalOpen(val);
    propOnOpenChange?.(val);
  };
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
      {trigger !== null && (!isControlled || trigger !== undefined) && (
        <DialogTrigger
          nativeButton={!trigger}
          render={
            trigger ? (
              (trigger as any)
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="Delete Mission"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )
          }
        />
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Mission</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold text-foreground">"{scenarioTitle}"</span> from the global library? This will also remove it from any assigned classrooms.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={handleDelete}
            className="gap-1.5 font-bold"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Delete Mission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
