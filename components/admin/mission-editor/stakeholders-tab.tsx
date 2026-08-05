"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Users, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Stakeholder, FollowUpQuestion } from "@/lib/definitions";
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
        name: "New Stakeholder",
        role: "Community Representative",
        initialStatement: "Initial statement during the civic investigation...",
        followUps: [
          { question: "What is your primary concern regarding this project?", answer: "We want clear guidelines and community involvement." },
        ],
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

  const addFollowUp = (stIdx: number) => {
    const next = [...stakeholders];
    const followUps = next[stIdx].followUps || [];
    next[stIdx] = {
      ...next[stIdx],
      followUps: [
        ...followUps,
        { question: "New Follow-up Question", answer: "Answer from stakeholder..." },
      ],
    };
    onChange(next);
  };

  const removeFollowUp = (stIdx: number, fIdx: number) => {
    const next = [...stakeholders];
    const followUps = (next[stIdx].followUps || []).filter((_, i) => i !== fIdx);
    next[stIdx] = { ...next[stIdx], followUps };
    onChange(next);
  };

  const updateFollowUp = (stIdx: number, fIdx: number, field: keyof FollowUpQuestion, value: string) => {
    const next = [...stakeholders];
    const followUps = [...(next[stIdx].followUps || [])];
    followUps[fIdx] = { ...followUps[fIdx], [field]: value };
    next[stIdx] = { ...next[stIdx], followUps };
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
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-muted-foreground hover:text-foreground">
                          <span className="text-[10px] text-muted-foreground hidden sm:inline">
                            {s.followUps?.length || 0} follow-up Qs
                          </span>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStakeholder(i)}
                        title="Delete stakeholder"
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
                            <Label className="text-xs font-semibold">Stakeholder Name</Label>
                            <Input
                              value={s.name}
                              onChange={(e) => updateStakeholder(i, "name", e.target.value)}
                              placeholder="e.g. Hon. Manuel Cruz"
                              className="text-xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Role / Title</Label>
                            <Input
                              value={s.role}
                              onChange={(e) => updateStakeholder(i, "role", e.target.value)}
                              placeholder="e.g. Barangay Chairman, Resident, SK Leader"
                              className="text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Initial Statement</Label>
                          <Textarea
                            value={s.initialStatement}
                            onChange={(e) => updateStakeholder(i, "initialStatement", e.target.value)}
                            placeholder="Initial opening statement when students interview this stakeholder..."
                            className="text-xs leading-relaxed"
                            rows={2}
                          />
                        </div>

                        {/* Nested Follow-Up Questions Editor */}
                        <div className="border-t border-border pt-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <MessageSquare className="h-3.5 w-3.5 text-primary" />
                              <Label className="text-xs font-semibold">Follow-Up Interview Questions</Label>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addFollowUp(i)}
                              className="h-7 text-[11px] gap-1"
                            >
                              <Plus className="h-3 w-3" /> Add Question
                            </Button>
                          </div>

                          {(s.followUps || []).length === 0 ? (
                            <p className="text-[11px] text-muted-foreground italic pl-1">
                              No follow-up questions added. Click &quot;Add Question&quot; to define Q&A pairs.
                            </p>
                          ) : (
                            <div className="space-y-2.5">
                              {(s.followUps || []).map((fq, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="p-3 border border-border rounded-md bg-muted/20 space-y-2 relative group"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                      Question #{fIdx + 1}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFollowUp(i, fIdx)}
                                      title="Delete follow-up question"
                                      className="h-6 text-[11px] gap-1 text-destructive/80 hover:text-destructive hover:bg-destructive/10 px-2 transition-colors"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      <span>Remove</span>
                                    </Button>
                                  </div>
                                  <Input
                                    value={fq.question}
                                    onChange={(e) => updateFollowUp(i, fIdx, "question", e.target.value)}
                                    placeholder="Student's Question..."
                                    className="text-xs bg-background h-8"
                                  />
                                  <Textarea
                                    value={fq.answer}
                                    onChange={(e) => updateFollowUp(i, fIdx, "answer", e.target.value)}
                                    placeholder="Stakeholder's Answer..."
                                    className="text-xs bg-background leading-relaxed"
                                    rows={2}
                                  />
                                </div>
                              ))}
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
