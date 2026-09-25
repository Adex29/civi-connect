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
import { Plus, Loader2, School, Key, BookOpen } from "lucide-react";
import { createClassroomAction } from "./actions";
import { toast } from "sonner";

export function CreateClassroomDialog({
  trigger,
  className,
}: {
  trigger?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a classroom name");
      return;
    }

    setLoading(true);
    try {
      const result = await createClassroomAction(name.trim(), description.trim());
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Classroom "${name}" created! Join code generated.`);
        setOpen(false);
        setName("");
        setDescription("");
      }
    } catch (err) {
      toast.error("Failed to create classroom. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ? (
            (trigger as any)
          ) : (
            <Button className={className || "gap-2 shadow-sm font-medium"}>
              <Plus className="h-4 w-4" />
              <span>Create Classroom</span>
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleCreate} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <School className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Create New Classroom</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Set up a class section to generate student join codes and assign civic missions.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Classroom Name */}
            <div className="space-y-2">
              <Label htmlFor="classroom-name" className="text-xs font-semibold">
                Classroom / Section Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="classroom-name"
                placeholder="e.g. CVC-3A Community Action"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
                className="h-10"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="classroom-description" className="text-xs font-semibold">
                Description <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="classroom-description"
                placeholder="Briefly describe the class period, semester, or target civic topic..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="resize-none text-xs"
              />
            </div>

            {/* Join Code Info Callout */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground">
              <Key className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground">Automatic 6-Character Join Code</p>
                <p className="text-[11px] leading-relaxed">
                  A unique join code will be generated upon creation. Students can use this code on the student registration portal to join this classroom.
                </p>
              </div>
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
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Create Classroom</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
