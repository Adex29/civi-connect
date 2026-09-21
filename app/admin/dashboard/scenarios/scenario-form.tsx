"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Save, Sparkles, Plus, Check, Lightbulb } from "lucide-react";
import { createScenarioAction, updateScenarioAction } from "./actions";
import { Scenario, MissionDataConfig } from "@/lib/definitions";
import { MissionEditorTabs } from "@/components/admin/mission-editor";
import { toast } from "sonner";

interface LimitationCategory {
  id: string;
  name: string;
  icon: string;
  items: string[];
}

const LIMITATION_SUGGESTIONS: LimitationCategory[] = [
  {
    id: "budget",
    name: "Budget & Resources",
    icon: "₱",
    items: [
      "Budget must not exceed ₱15,000 from local barangay development funds.",
      "Must utilize existing community facilities with zero new machinery procurement.",
      "Emergency contingency spending is capped at 10% of total allocated funds.",
    ],
  },
  {
    id: "timeline",
    name: "Timeline & Scheduling",
    icon: "⏱",
    items: [
      "Intervention must be implemented within a 30-day barangay action window.",
      "Student activities must be scheduled outside school hours or on weekends.",
      "Must establish visible milestone improvements within the first 14 days.",
    ],
  },
  {
    id: "governance",
    name: "Governance & SK",
    icon: "👥",
    items: [
      "Must actively coordinate with Sangguniang Kabataan (SK) and youth council.",
      "Requires formal authorization from the Barangay Captain prior to rollout.",
      "Must establish a joint steering committee of students and local officials.",
    ],
  },
  {
    id: "statutory",
    name: "Legal & Statutory",
    icon: "⚖",
    items: [
      "Must strictly adhere to RA 9003 (Ecological Solid Waste Management Act).",
      "Must preserve public right-of-way and unhindered emergency vehicle access.",
      "Must comply with DepEd child protection and student volunteer safety protocols.",
    ],
  },
  {
    id: "community",
    name: "Community & Impact",
    icon: "🌱",
    items: [
      "Must conduct verified consultations with at least 2 contrasting resident households.",
      "Intervention plan must be environmentally sustainable and produce zero net waste.",
      "Must organize a community orientation briefing at the barangay hall.",
    ],
  },
];

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const currentConstraintsList = constraints
    .split("\n")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const isLimitationAdded = (text: string) => {
    return currentConstraintsList.includes(text.trim());
  };

  const handleToggleLimitation = (text: string) => {
    const trimmed = text.trim();
    if (isLimitationAdded(trimmed)) {
      const filtered = currentConstraintsList.filter((c) => c !== trimmed);
      setConstraints(filtered.join("\n"));
      toast.info("Removed limitation from mission");
    } else {
      const updated = constraints.trim().length > 0
        ? `${constraints.trim()}\n${trimmed}`
        : trimmed;
      setConstraints(updated);
      toast.success("Added limitation to mission");
    }
  };

  const handleApplyStandardLimitations = () => {
    const standards = [
      "Budget must not exceed ₱15,000 from local barangay development funds.",
      "Must actively coordinate with Sangguniang Kabataan (SK) and youth council.",
      "Must conduct verified consultations with at least 2 contrasting resident households.",
    ];

    let countAdded = 0;
    const existing = new Set(currentConstraintsList);
    const newItems = [...currentConstraintsList];

    for (const item of standards) {
      if (!existing.has(item)) {
        newItems.push(item);
        countAdded++;
      }
    }

    if (countAdded === 0) {
      toast.info("Standard limitations are already added");
      return;
    }

    setConstraints(newItems.join("\n"));
    toast.success(`Applied ${countAdded} standard DepEd civic limitation(s)`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !constraints.trim()) {
      toast.error("All mission fields (Title, Description, Constraints) are required");
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
          ? "Mission updated successfully"
          : "Mission created successfully"
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
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Mission Library
          </Link>
          <h2 className="page-title text-3xl">
            {isEditing ? `Edit: ${scenario?.title}` : "Create New Civic Mission"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Update mission parameters, constraints, and dynamic simulation content."
              : "Define general mission details and configure the simulation engine."}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/admin/dashboard/scenarios" className="inline-flex">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Save Changes" : "Create Mission"}
          </Button>
        </div>
      </div>

      {/* Basic Mission Information Card */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">General Information & Requirements</CardTitle>
          <CardDescription className="text-xs">
            Basic background details visible to students when this mission is assigned.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs font-semibold">
              Mission Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-xs font-semibold">
                Detailed Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                className="min-h-[110px] text-xs leading-relaxed"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Label htmlFor="constraints" className="text-xs font-semibold flex items-center gap-1.5">
                  <span>Constraints & Limitations</span>
                  <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="h-7 text-xs gap-1.5 text-primary border-primary/30 hover:bg-primary/10 font-semibold"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    {showSuggestions ? "Hide Suggestions" : "Suggest Limitations"}
                  </Button>
                </div>
              </div>

              <Textarea
                id="constraints"
                className="min-h-[110px] text-xs font-mono leading-relaxed"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                required
              />

              <div className="flex items-center justify-between text-[11px] text-muted-foreground flex-wrap gap-1">
                <span>
                  {currentConstraintsList.length} limitation{currentConstraintsList.length === 1 ? "" : "s"} defined (one per line)
                </span>
                {!showSuggestions && (
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(true)}
                    className="text-primary hover:underline flex items-center gap-1 text-[11px] font-medium"
                  >
                    <Lightbulb className="h-3 w-3" /> Need ideas? Click to browse suggestions
                  </button>
                )}
              </div>

              {/* Suggestions Panel */}
              {showSuggestions && (
                <div className="p-3.5 rounded-lg border border-primary/25 bg-primary/[0.03] dark:bg-primary/[0.06] space-y-3 mt-1 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-primary/10 text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-foreground">Suggested Mission Limitations</span>
                        <p className="text-[11px] text-muted-foreground">Click any limitation to add or remove it from the mission</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleApplyStandardLimitations}
                      className="h-7 text-[11px] gap-1 font-semibold self-start sm:self-auto"
                    >
                      <Plus className="h-3 w-3" /> Add Standard 3
                    </Button>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("all")}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                        selectedCategory === "all"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground hover:bg-muted border-border"
                      }`}
                    >
                      All Suggestions
                    </button>
                    {LIMITATION_SUGGESTIONS.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors flex items-center gap-1 ${
                          selectedCategory === cat.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground hover:bg-muted border-border"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Suggestions List */}
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {LIMITATION_SUGGESTIONS.filter((cat) => selectedCategory === "all" || selectedCategory === cat.id)
                      .flatMap((cat) => cat.items)
                      .map((item, idx) => {
                        const added = isLimitationAdded(item);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleToggleLimitation(item)}
                            className={`p-2 rounded-md border text-xs cursor-pointer flex items-start justify-between gap-2 transition-colors ${
                              added
                                ? "bg-primary/10 border-primary/40 text-foreground font-medium"
                                : "bg-card hover:bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span className="leading-snug">{item}</span>
                            <div className="shrink-0 pt-0.5">
                              {added ? (
                                <Badge className="bg-primary text-primary-foreground text-[10px] h-4 px-1.5 gap-0.5">
                                  <Check className="h-2.5 w-2.5" /> Added
                                </Badge>
                              ) : (
                                <span className="text-[11px] text-primary flex items-center gap-0.5 font-semibold hover:underline">
                                  <Plus className="h-3 w-3" /> Add
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic 8-Step Mission Configuration */}
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
          {isEditing ? "Make sure to save changes before navigating away." : "Ready to launch this mission?"}
        </p>
        <div className="flex items-center gap-3 ml-auto">
          <Link href="/admin/dashboard/scenarios" className="inline-flex">
            <Button type="button" variant="ghost" size="sm">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading} size="sm" className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Save Changes" : "Create Mission"}
          </Button>
        </div>
      </div>
    </form>
  );
}
