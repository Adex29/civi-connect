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
import { Trash2, Loader2, AlertTriangle, Archive } from "lucide-react";
import { deleteClassroomAction, toggleClassroomStatusAction } from "./actions";
import { toast } from "sonner";

export function DeleteClassroomDialog({
  classroomId,
  classroomName,
  studentCount = 0,
  trigger,
}: {
  classroomId: string;
  classroomName: string;
  studentCount?: number;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteClassroomAction(classroomId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Classroom "${classroomName}" deleted.`);
        setOpen(false);
      }
    } catch (err) {
      toast.error("Failed to delete classroom");
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    setArchiveLoading(true);
    try {
      const result = await toggleClassroomStatusAction(classroomId, "archived");
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Classroom "${classroomName}" moved to archive.`);
        setOpen(false);
      }
    } catch (err) {
      toast.error("Failed to archive classroom");
    } finally {
      setArchiveLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ? (
            (trigger as any)
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Delete Classroom"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-destructive">
                Delete Classroom
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                This action is permanent and will remove associated mission assignments.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2 text-sm text-muted-foreground">
          <p>
            Are you sure you want to delete <span className="font-semibold text-foreground">"{classroomName}"</span>?
          </p>

          {studentCount > 0 && (
            <div className="p-3 rounded-md bg-muted/50 border text-xs text-foreground">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-foreground shrink-0" />
                {studentCount} {studentCount === 1 ? "student is" : "students are"} enrolled in this classroom.
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Deleting this classroom removes it from student dashboards. If you want to preserve student submissions, consider archiving instead.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleArchive}
            disabled={loading || archiveLoading}
            className="gap-1.5 text-xs order-2 sm:order-1"
          >
            {archiveLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Archive className="h-3.5 w-3.5" />}
            Archive Instead
          </Button>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={loading || archiveLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={loading || archiveLoading}
              onClick={handleDelete}
              className="gap-1.5"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Delete Classroom
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
