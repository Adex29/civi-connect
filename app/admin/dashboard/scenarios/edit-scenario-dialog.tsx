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
import { Edit, Loader2 } from "lucide-react";
import { updateScenarioAction } from "./actions";
import { Scenario } from "@/lib/definitions";
import { toast } from "sonner";

export function EditScenarioDialog({ scenario }: { scenario: Scenario }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(scenario.title);
  const [description, setDescription] = useState(scenario.description);
  const [constraints, setConstraints] = useState(scenario.constraints.join("\n"));

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim() || !constraints.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    const result = await updateScenarioAction(scenario.id, title, description, constraints);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Scenario updated successfully");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="sm">
          <Edit className="mr-1 h-3.5 w-3.5" />
          Edit
        </Button>
      } />
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Scenario</DialogTitle>
          <DialogDescription>
            Update the scenario details and requirements.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Scenario Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-scenario-description">Detailed Description</Label>
            <Textarea
              id="edit-scenario-description"
              className="min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-constraints">Constraints / Requirements</Label>
            <p className="text-xs text-muted-foreground">Enter one requirement per line.</p>
            <Textarea
              id="edit-constraints"
              className="min-h-[120px]"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={handleUpdate}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
