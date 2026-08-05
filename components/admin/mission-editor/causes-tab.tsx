"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { CauseItem } from "@/lib/definitions";
import { Sortable, SortableDragHandle } from "@/components/ui/sortable";

interface CausesTabProps {
  causes: CauseItem[];
  onChange: (causes: CauseItem[]) => void;
}

export function CausesTab({ causes, onChange }: CausesTabProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addCause = () => {
    const id = `c${Date.now()}`;
    onChange([
      ...causes,
      { id, title: "New Contributing Factor", description: "Brief description of this cause." },
    ]);
    setExpandedIds((prev) => ({ ...prev, [id]: true }));
  };

  const removeCause = (idx: number) => {
    onChange(causes.filter((_, i) => i !== idx));
  };

  const updateCause = (idx: number, field: keyof CauseItem, value: string) => {
    const next = [...causes];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  // Ensure every item has a unique id for sortable
  const itemsWithId = causes.map((c, i) => ({
    ...c,
    id: c.id || `cause-${i}`,
  }));

  return (
    <TabsContent value="causes" className="m-0 w-full">
      <Card className="w-full border border-border shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                <span>Step 2: Root Causes & Contributing Factors</span>
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                {causes.length} Factors
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Manage the systemic causes that students will analyze and connect in Step 2.
            </CardDescription>
          </div>
          <Button type="button" size="sm" onClick={addCause} className="gap-1 text-xs shrink-0">
            <Plus className="h-3.5 w-3.5" /> Add Cause
          </Button>
        </CardHeader>

        <CardContent>
          {causes.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg bg-muted/30 space-y-2">
              <HelpCircle className="h-8 w-8 mx-auto text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground font-medium">No root causes added yet.</p>
              <Button type="button" size="sm" variant="outline" onClick={addCause} className="text-xs gap-1">
                <Plus className="h-3.5 w-3.5" /> Add First Cause
              </Button>
            </div>
          ) : (
            <Sortable
              items={itemsWithId}
              onValueChange={(nextItems) => onChange(nextItems)}
              renderItem={(c, i) => {
                const isExpanded = expandedIds[c.id] !== false; // expanded by default

                return (
                  <div className="border border-border rounded-lg bg-card shadow-xs overflow-hidden transition-all">
                    {/* Header Row */}
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/30 border-b border-border">
                      <SortableDragHandle />
                      <Badge variant="outline" className="text-[10px] font-mono shrink-0 bg-background">
                        C{i + 1}
                      </Badge>
                      <div
                        onClick={() => toggleExpand(c.id)}
                        className="flex-1 cursor-pointer flex items-center justify-between min-w-0"
                      >
                        <span className="font-semibold text-xs truncate">
                          {c.title || "Untitled Cause"}
                        </span>
                        <div className="flex items-center gap-2 shrink-0 text-muted-foreground hover:text-foreground">
                          <span className="text-[10px] text-muted-foreground hidden sm:inline truncate max-w-[200px]">
                            {c.description}
                          </span>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCause(i)}
                        title="Delete cause factor"
                        className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 shrink-0 h-7 w-7 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Expandable Form Body */}
                    {isExpanded && (
                      <div className="p-4 space-y-3 bg-card">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Cause Title</Label>
                          <Input
                            value={c.title}
                            onChange={(e) => updateCause(i, "title", e.target.value)}
                            placeholder="e.g. Weak Regulatory Enforcement"
                            className="text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Description & Context</Label>
                          <Textarea
                            value={c.description}
                            onChange={(e) => updateCause(i, "description", e.target.value)}
                            placeholder="Describe how this cause impacts the civic problem..."
                            className="text-xs leading-relaxed"
                            rows={2}
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
