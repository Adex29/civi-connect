"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileText, Star, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { EvidenceItem } from "@/lib/definitions";
import { Sortable, SortableDragHandle } from "@/components/ui/sortable";

export const EVIDENCE_TYPE_OPTIONS: ComboboxOption[] = [
  { value: "Government Report", label: "Government Report", sublabel: "Official municipal & agency reports" },
  { value: "Article Photo", label: "Article Photo", sublabel: "Photo evidence & visual documentation" },
  { value: "Community Survey", label: "Community Survey", sublabel: "Local household & resident feedback" },
  { value: "Survey News", label: "Survey News", sublabel: "News coverage of community surveys" },
  { value: "Interview", label: "Interview", sublabel: "Transcripts with key informants" },
  { value: "Budget Report", label: "Budget Report", sublabel: "Barangay fiscal statements" },
  { value: "Map", label: "Map", sublabel: "Spatial & geographic hazard maps" },
  { value: "Social Media", label: "Social Media", sublabel: "Public posts & community concerns" },
  { value: "News Article", label: "News Article", sublabel: "Journalistic reports & investigations" },
];

interface EvidenceTabProps {
  evidence: EvidenceItem[];
  onChange: (evidence: EvidenceItem[]) => void;
}

export function EvidenceTab({ evidence, onChange }: EvidenceTabProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addEvidence = () => {
    const id = `ev${Date.now()}`;
    onChange([
      ...evidence,
      {
        id,
        title: "New Evidence Source",
        type: "Government Report",
        snippet: "Short preview snippet...",
        fullText: "Full body text of the evidence document...",
        defaultCredibility: 4,
        supports: ["cause", "need"],
      },
    ]);
    setExpandedIds((prev) => ({ ...prev, [id]: true }));
  };

  const removeEvidence = (idx: number) => {
    onChange(evidence.filter((_, i) => i !== idx));
  };

  const updateEvidence = (idx: number, field: keyof EvidenceItem, value: any) => {
    const next = [...evidence];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  const itemsWithId = evidence.map((ev, i) => ({
    ...ev,
    id: ev.id || `evidence-${i}`,
  }));

  return (
    <TabsContent value="evidence" className="m-[0_!important] w-full">
      <Card className="w-full border border-border shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span>Step 3: Digital Evidence Library</span>
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                {evidence.length} Documents
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Manage reports, articles, surveys, and photos that students will inspect in Step 3.
            </CardDescription>
          </div>
          <Button type="button" size="sm" onClick={addEvidence} className="gap-1 text-xs shrink-0">
            <Plus className="h-3.5 w-3.5" /> Add Evidence
          </Button>
        </CardHeader>

        <CardContent>
          {evidence.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg bg-muted/30 space-y-2">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground font-medium">No evidence items added yet.</p>
              <Button type="button" size="sm" variant="outline" onClick={addEvidence} className="text-xs gap-1">
                <Plus className="h-3.5 w-3.5" /> Add First Evidence
              </Button>
            </div>
          ) : (
            <Sortable
              items={itemsWithId}
              onValueChange={(nextItems) => onChange(nextItems)}
              renderItem={(ev, i) => {
                const isExpanded = expandedIds[ev.id] !== false; // expanded by default

                return (
                  <div className="border border-border rounded-lg bg-card shadow-xs overflow-hidden transition-all">
                    {/* Header Row */}
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/30 border-b border-border">
                      <SortableDragHandle />
                      <Badge variant="outline" className="text-[10px] font-mono shrink-0 bg-background">
                        EV{i + 1}
                      </Badge>
                      <div
                        onClick={() => toggleExpand(ev.id)}
                        className="flex-1 cursor-pointer flex items-center justify-between min-w-0"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-semibold text-xs truncate">
                            {ev.title || "Untitled Evidence"}
                          </span>
                          <Badge variant="secondary" className="text-[10px] shrink-0 font-normal">
                            {ev.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-muted-foreground hover:text-foreground">
                          {/* Star Rating Indicator */}
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= (ev.defaultCredibility || 3) ? "fill-primary text-primary" : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEvidence(i)}
                        title="Delete evidence document"
                        className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 shrink-0 h-7 w-7 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Form Body */}
                    {isExpanded && (
                      <div className="p-4 space-y-4 bg-card">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Evidence Title</Label>
                            <Input
                              value={ev.title}
                              onChange={(e) => updateEvidence(i, "title", e.target.value)}
                              placeholder="e.g. Official Barangay Environmental Report"
                              className="text-xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold block">Evidence Type</Label>
                            <Combobox
                              options={
                                ev.type && !EVIDENCE_TYPE_OPTIONS.some((o) => o.value === ev.type)
                                  ? [{ value: ev.type, label: ev.type }, ...EVIDENCE_TYPE_OPTIONS]
                                  : EVIDENCE_TYPE_OPTIONS
                              }
                              value={ev.type}
                              onValueChange={(val) => updateEvidence(i, "type", val)}
                              placeholder="Select evidence type..."
                              searchPlaceholder="Search types..."
                            />
                          </div>
                        </div>

                        {/* Interactive Star Rating Selector */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg border border-border bg-muted/20">
                          <div className="space-y-0.5">
                            <Label className="text-xs font-semibold">Source Credibility Rating</Label>
                            <p className="text-[10px] text-muted-foreground">
                              Sets the baseline credibility score (1-5 stars) students will judge.
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => updateEvidence(i, "defaultCredibility", star)}
                                className="p-1 hover:scale-110 transition-transform focus:outline-none"
                              >
                                <Star
                                  className={`h-5 w-5 ${
                                    star <= (ev.defaultCredibility || 3)
                                      ? "fill-primary text-primary"
                                      : "text-muted-foreground/30 hover:text-primary/50"
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs font-bold text-primary ml-1 min-w-[20px]">
                              {ev.defaultCredibility || 3}/5
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Snippet Preview</Label>
                          <Input
                            value={ev.snippet}
                            onChange={(e) => updateEvidence(i, "snippet", e.target.value)}
                            placeholder="Brief snippet displayed in search results..."
                            className="text-xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Full Document Content</Label>
                          <Textarea
                            value={ev.fullText}
                            onChange={(e) => updateEvidence(i, "fullText", e.target.value)}
                            placeholder="Full body text of the report or interview..."
                            className="text-xs leading-relaxed"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2 border-t border-border pt-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold flex items-center gap-1.5">
                              <ImageIcon className="h-3.5 w-3.5 text-primary" />
                              Image / Attachment URL (Optional)
                            </Label>
                            {ev.imageUrl && <span className="text-[10px] text-primary font-bold">✓ Attached</span>}
                          </div>
                          <Input
                            placeholder="https://images.unsplash.com/... or data:image/..."
                            value={ev.imageUrl || ""}
                            onChange={(e) => updateEvidence(i, "imageUrl", e.target.value)}
                            className="text-xs"
                          />
                          {ev.imageUrl && (
                            <div className="mt-2 h-28 w-48 overflow-hidden rounded-md border border-border shadow-xs relative bg-muted">
                              <img src={ev.imageUrl} alt="Evidence preview" className="w-full h-full object-cover" />
                            </div>
                          )}
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
