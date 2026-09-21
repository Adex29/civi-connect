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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Edit2, Loader2, School, Save, CheckCircle2, Archive } from "lucide-react";
import { updateClassroomAction } from "./actions";
import { Classroom } from "@/lib/definitions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const statusOptions: ComboboxOption[] = [
  { value: "active", label: "Active", sublabel: "Students can join & submit" },
  { value: "archived", label: "Archived", sublabel: "Read-only historical view" },
];

export function EditClassroomDialog({
  classroom,
  trigger,
  open: propOpen,
  onOpenChange: propOnOpenChange,
}: {
  classroom: Classroom;
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
  const [name, setName] = useState(classroom.name);
  const [description, setDescription] = useState(classroom.description || "");
  const [status, setStatus] = useState<"active" | "archived">(classroom.status);

  // Sync state if classroom updates
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setName(classroom.name);
      setDescription(classroom.description || "");
      setStatus(classroom.status);
    }
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      toast.error("Classroom name is required");
      return;
    }

    setLoading(true);
    try {
      const result = await updateClassroomAction(classroom.id, name.trim(), description.trim(), status);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Classroom "${name}" updated successfully`);
        setOpen(false);
      }
    } catch (err) {
      toast.error("Failed to update classroom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger !== null && (!isControlled || trigger !== undefined) && (
        <DialogTrigger
          render={
            trigger ? (
              (trigger as any)
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Edit Classroom"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            )
          }
        />
      )}
      <DialogContent className="sm:max-w-[460px]">
        <form onSubmit={handleUpdate} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <School className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Edit Classroom</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Update classroom details, section title, and active status.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Classroom Name */}
            <div className="space-y-1.5">
              <Label htmlFor={`edit-name-${classroom.id}`} className="text-xs font-semibold">
                Classroom Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`edit-name-${classroom.id}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor={`edit-desc-${classroom.id}`} className="text-xs font-semibold">
                Description <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id={`edit-desc-${classroom.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="resize-none text-xs"
                placeholder="Classroom description, schedule, or period..."
              />
            </div>

            {/* Status Select */}
            <div className="space-y-1.5">
              <Label htmlFor={`edit-status-${classroom.id}`} className="text-xs font-semibold">
                Classroom Status
              </Label>
              <Combobox
                options={statusOptions}
                value={status}
                onValueChange={(val) => setStatus(val as "active" | "archived")}
                placeholder="Select status..."
                searchPlaceholder="Search status..."
                className="h-10 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-3 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()} className="gap-1.5">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
