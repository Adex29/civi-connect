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
import { Plus, Loader2 } from "lucide-react";
import { createScenarioAction } from "./actions";
import { toast } from "sonner";

export function CreateScenarioDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [constraints, setConstraints] = useState("");

  const handleCreate = async () => {
    if (!title.trim() || !description.trim() || !constraints.trim()) {
      toast.error("All fields are required");
      return;
    }
    
    setLoading(true);
    const result = await createScenarioAction(title, description, constraints);
    setLoading(false);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Scenario created successfully");
      setOpen(false);
      setTitle("");
      setDescription("");
      setConstraints("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Scenario
        </Button>
      } />
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Global Scenario</DialogTitle>
          <DialogDescription>
            Add a new scenario to the global library. You can assign it to classrooms later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Scenario Title</Label>
            <Input
              id="title"
              placeholder="e.g. Community Park Renovation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Explain the background and the problem to solve..."
              className="min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="constraints">Constraints / Requirements</Label>
            <p className="text-xs text-muted-foreground">Enter one requirement per line.</p>
            <Textarea
              id="constraints"
              placeholder="Budget must not exceed $5,000&#10;Must include a timeline of 3 months&#10;Must involve at least 2 community groups"
              className="min-h-[120px]"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={handleCreate}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Scenario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
