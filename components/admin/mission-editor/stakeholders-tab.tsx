"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Stakeholder } from "@/lib/definitions";
import { Sortable, SortableDragHandle } from "@/components/ui/sortable";

interface StakeholdersTabProps {
  stakeholders: Stakeholder[];
  onChange: (stakeholders: Stakeholder[]) => void;
}

export function StakeholdersTab({ stakeholders, onChange }: StakeholdersTabProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addStakeholder = () => {
    const id = `st${Date.now()}`;
    onChange([
      ...stakeholders,
      {
        id,
        name: "",
        role: "",
        initialStatement: "",
        isIrrelevant: false,
      },
    ]);
    setExpandedIds((prev) => ({ ...prev, [id]: true }));
  };

  const removeStakeholder = (idx: number) => {
    onChange(stakeholders.filter((_, i) => i !== idx));
  };

  const updateStakeholder = (idx: number, field: keyof Stakeholder, value: any) => {
    const next = [...stakeholders];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  const itemsWithId = stakeholders.map((s, i) => ({
    ...s,
    id: s.id || `stakeholder-${i}`,
  }));

  return (
    <TabsContent value="stakeholders" className="m-0 w-full">
      <Card className="w-full border border-border shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary shrink-0" />
                <span>Step 4: Stakeholders & Interviewees</span>
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                {stakeholders.length} Stakeholders
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Manage key community figures, officials, and residents students can consult in Step 4.
            </CardDescription>
          </div>
          <Button type="button" size="sm" onClick={addStakeholder} className="gap-1 text-xs shrink-0">
            <Plus className="h-3.5 w-3.5" /> Add Stakeholder
          </Button>
        </CardHeader>

        <CardContent>
          {stakeholders.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg bg-muted/30 space-y-2">
              <Users className="h-8 w-8 mx-auto text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground font-medium">No stakeholders added yet.</p>
              <Button type="button" size="sm" variant="outline" onClick={addStakeholder} className="text-xs gap-1">
                <Plus className="h-3.5 w-3.5" /> Add First Stakeholder
              </Button>
            </div>
          ) : (
            <Sortable
              items={itemsWithId}
              onValueChange={(nextItems) => onChange(nextItems)}
              renderItem={(s, i) => {
                const isExpanded = expandedIds[s.id] !== false; // expanded by default

                return (
                  <div className="border border-border rounded-lg bg-card shadow-xs overflow-hidden transition-all">
                    {/* Header Row */}
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/30 border-b border-border">
                      <SortableDragHandle />
                      <Badge variant="outline" className="text-[10px] font-mono shrink-0 bg-background">
                        S{i + 1}
                      </Badge>
                      <div
                        onClick={() => toggleExpand(s.id)}
                        className="flex-1 cursor-pointer flex items-center justify-between min-w-0"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-semibold text-xs truncate">
                            {s.name || "Untitled Stakeholder"}
                          </span>
                          {s.role && (
                            <Badge variant="secondary" className="text-[10px] shrink-0 font-normal">
                              {s.role}
                            </Badge>
                          )}
                          {s.isIrrelevant ? (
                            <Badge variant="outline" className="text-[10px] shrink-0 font-medium border-amber-500/50 text-amber-600 bg-amber-500/10">
                              Irrelevant Distractor
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] shrink-0 font-medium border-primary/50 text-primary bg-primary/10">
                              Relevant
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-muted-foreground hover:text-foreground">
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeStakeholder(i)}
                        title="Remove stakeholder"
                        className="h-8 w-8 shrink-0 border border-transparent text-destructive/80 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 hover:shadow-md transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Form Body */}
                    {isExpanded && (
                      <div className="p-4 space-y-4 bg-card">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Stakeholder Name</Label>
                            <Input
                              value={s.name}
                              onChange={(e) => updateStakeholder(i, "name", e.target.value)}
                              className="text-xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Role / Title</Label>
                            <Input
                              value={s.role}
                              onChange={(e) => updateStakeholder(i, "role", e.target.value)}
                              className="text-xs"
                            />
                          </div>
                        </div>

                        {/* Relevance Selector */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Stakeholder Relevance</Label>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => updateStakeholder(i, "isIrrelevant", false)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                                !s.isIrrelevant
                                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                  : "bg-card text-muted-foreground border-border hover:bg-muted"
                              }`}
                            >
                              <span className={`text-[10px] font-bold ${!s.isIrrelevant ? "text-primary-foreground" : "text-primary"}`}>
                                {!s.isIrrelevant ? "✓" : "+"}
                              </span>
                              <span>Relevant Stakeholder</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => updateStakeholder(i, "isIrrelevant", true)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                                s.isIrrelevant
                                  ? "bg-amber-600 text-white border-amber-600 dark:bg-amber-600 shadow-xs"
                                  : "bg-card text-muted-foreground border-border hover:bg-amber-500/10 hover:text-amber-700 hover:border-amber-500/30"
                              }`}
                            >
                              <span className={`text-[10px] font-bold ${s.isIrrelevant ? "text-white" : "text-amber-600"}`}>
                                {s.isIrrelevant ? "✓" : "!"}
                              </span>
                              <span>Irrelevant / Distractor</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Statement</Label>
                          <Textarea
                            value={s.initialStatement}
                            onChange={(e) => updateStakeholder(i, "initialStatement", e.target.value)}
                            className="text-xs leading-relaxed"
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
