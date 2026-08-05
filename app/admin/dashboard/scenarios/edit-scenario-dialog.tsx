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
import { Scenario, MissionDataConfig } from "@/lib/definitions";
import { MissionEditorTabs } from "@/components/admin/mission-editor";
import { toast } from "sonner";

export function EditScenarioDialog({ scenario }: { scenario: Scenario }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(scenario.title);
  const [description, setDescription] = useState(scenario.description);
  const [constraints, setConstraints] = useState(scenario.constraints.join("\n"));
  const [missionData, setMissionData] = useState<MissionDataConfig | undefined>(scenario.missionData);

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim() || !constraints.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    const result = await updateScenarioAction(scenario.id, title, description, constraints, missionData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Scenario and mission data updated successfully");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="sm">
          <Edit className="mr-1 h-3.5 w-3.5" />
          Edit Mission
        </Button>
      } />
      <DialogContent className="sm:max-w-[750px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Civic Mission Scenario</DialogTitle>
          <DialogDescription>
            Update scenario details, requirements, and dynamic 7-step mission parameters.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
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
              className="min-h-[90px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-constraints">Constraints / Requirements</Label>
            <p className="text-xs text-muted-foreground">Enter one requirement per line.</p>
            <Textarea
              id="edit-constraints"
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
          <Button disabled={loading} onClick={handleUpdate}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
