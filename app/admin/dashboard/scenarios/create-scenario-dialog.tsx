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
import { MissionEditorTabs } from "@/components/admin/mission-editor";
import { MissionDataConfig } from "@/lib/definitions";
import { toast } from "sonner";

export function CreateScenarioDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [constraints, setConstraints] = useState("");
  const [missionData, setMissionData] = useState<MissionDataConfig | undefined>(undefined);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim() || !constraints.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    const result = await createScenarioAction(title, description, constraints, missionData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Scenario and mission data created successfully");
      setOpen(false);
      setTitle("");
      setDescription("");
      setConstraints("");
      setMissionData(undefined);
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
      <DialogContent className="sm:max-w-[750px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Civic Mission Scenario</DialogTitle>
          <DialogDescription>
            Add a new scenario to the global library. Dynamically configure 7-step mission parameters below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Scenario Title</Label>
            <Input
              id="title"
              placeholder="e.g. Community Park Renovation & Waterway Clean-up"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Explain the background, barangay context, and civic problem to solve..."
              className="min-h-[90px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="constraints">Constraints / Requirements</Label>
            <p className="text-xs text-muted-foreground">Enter one requirement per line.</p>
            <Textarea
              id="constraints"
              placeholder="Budget must not exceed ₱15,000&#10;Must involve SK youth leadership&#10;Must conduct 2 community surveys"
              className="min-h-[90px]"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
          </div>

          {/* Dynamic Mission Configuration */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-bold text-sm text-primary">Dynamic 7-Step Mission Configuration</h4>
            <p className="text-xs text-muted-foreground">
              Customize issues, causes, evidence library, stakeholders, and challenges for this mission.
            </p>
            <MissionEditorTabs
              initialConfig={missionData}
              onChange={(cfg) => setMissionData(cfg)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={handleCreate}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Scenario & Mission Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
