"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { createScenarioAction, updateScenarioAction } from "./actions";
import { Scenario, MissionDataConfig } from "@/lib/definitions";
import { MissionEditorTabs } from "@/components/admin/mission-editor";
import { toast } from "sonner";

interface ScenarioFormProps {
  scenario?: Scenario;
}

export function ScenarioForm({ scenario }: ScenarioFormProps) {
  const router = useRouter();
  const isEditing = Boolean(scenario);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(scenario?.title || "");
  const [description, setDescription] = useState(scenario?.description || "");
  const [constraints, setConstraints] = useState(scenario?.constraints?.join("\n") || "");
  const [missionData, setMissionData] = useState<MissionDataConfig | undefined>(scenario?.missionData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !constraints.trim()) {
      toast.error("All scenario fields (Title, Description, Constraints) are required");
      return;
    }

    setLoading(true);
    let result;

    if (isEditing && scenario) {
      result = await updateScenarioAction(scenario.id, title, description, constraints, missionData);
    } else {
      result = await createScenarioAction(title, description, constraints, missionData);
    }

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        isEditing
          ? "Scenario and mission data updated successfully"
          : "Scenario and mission data created successfully"
      );
      router.push("/admin/dashboard/scenarios");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <Link
            href="/admin/dashboard/scenarios"
            className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Scenario Library
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? `Edit: ${scenario?.title}` : "Create New Civic Mission Scenario"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Update scenario parameters, constraints, and dynamic simulation content."
              : "Define general scenario details and configure the dynamic 7-step mission engine."}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/admin/dashboard/scenarios">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Save Changes" : "Create Scenario"}
          </Button>
        </div>
      </div>

      {/* Basic Scenario Information Card */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">General Information & Requirements</CardTitle>
          <CardDescription className="text-xs">
            Basic background details visible to students when this scenario is assigned.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs font-semibold">
              Scenario Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Community Park Renovation & Waterway Clean-up"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-xs font-semibold">
                Detailed Description <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Explain the background context, barangay environment, and primary problem..."
                className="min-h-[110px] text-xs leading-relaxed"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="constraints" className="text-xs font-semibold">
                  Constraints & Criteria <span className="text-rose-500">*</span>
                </Label>
                <span className="text-[10px] text-muted-foreground">One requirement per line</span>
              </div>
              <Textarea
                id="constraints"
                placeholder="Budget must not exceed ₱15,000&#10;Must involve SK youth leadership&#10;Must conduct 2 community surveys"
                className="min-h-[110px] text-xs font-mono leading-relaxed"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic 7-Step Mission Configuration */}
      <div className="space-y-4 pt-2">
        <div className="border-b pb-2">
          <h3 className="text-lg font-bold tracking-tight text-primary">Mission Configuration</h3>
          <p className="text-xs text-muted-foreground">
            Configure issues, root causes, evidence library, stakeholders, unexpected challenges, and step guidance tips.
          </p>
        </div>

        <MissionEditorTabs
          initialConfig={missionData}
          onChange={(cfg) => setMissionData(cfg)}
        />
      </div>

      {/* Sticky Bottom Bar for Action Buttons on Long Scroll */}
      <div className="sticky bottom-4 bg-background/95 backdrop-blur border p-4 rounded-xl shadow-lg flex items-center justify-between z-30">
        <p className="text-xs text-muted-foreground hidden sm:block">
          {isEditing ? "Make sure to save changes before navigating away." : "Ready to launch this scenario?"}
        </p>
        <div className="flex items-center gap-3 ml-auto">
          <Link href="/admin/dashboard/scenarios">
            <Button type="button" variant="ghost" size="sm">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading} size="sm" className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Save Changes" : "Create Scenario"}
          </Button>
        </div>
      </div>
    </form>
  );
}
