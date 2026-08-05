"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Zap, CheckCircle } from "lucide-react";
import { UnexpectedEvent } from "@/lib/definitions";

interface ChallengeTabProps {
  unexpectedEvent: UnexpectedEvent;
  onChange: (unexpectedEvent: UnexpectedEvent) => void;
}

export function ChallengeTab({ unexpectedEvent, onChange }: ChallengeTabProps) {
  const options = unexpectedEvent.options || [];

  const addOption = () => {
    const newOptions = [
      ...options,
      {
        id: `opt${Date.now()}`,
        text: "New Decision Choice",
        isOptimal: false,
        feedback: "Feedback explaining the consequences of this choice.",
      },
    ];
    onChange({ ...unexpectedEvent, options: newOptions });
  };

  const removeOption = (idx: number) => {
    const newOptions = options.filter((_, i) => i !== idx);
    onChange({ ...unexpectedEvent, options: newOptions });
  };

  const updateOption = (idx: number, field: string, value: any) => {
    const newOptions = [...options];
    newOptions[idx] = { ...newOptions[idx], [field]: value };
    onChange({ ...unexpectedEvent, options: newOptions });
  };

  const setOptimal = (idx: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isOptimal: i === idx,
    }));
    onChange({ ...unexpectedEvent, options: newOptions });
  };

  return (
    <TabsContent value="challenge" className="m-0 w-full">
      <Card className="w-full border border-border shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary shrink-0" />
                <span>Step 6: Mid-Simulation Unexpected Challenge Event</span>
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                {options.length} Decision Choices
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Define the mid-mission crisis or surprise obstacle and decision choices students encounter in Step 6.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Event Metadata */}
          <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Event Title</Label>
              <Input
                value={unexpectedEvent.title}
                onChange={(e) => onChange({ ...unexpectedEvent, title: e.target.value })}
                placeholder="e.g. Unexpected Challenge: Subsidies Reduced by 25%"
                className="text-xs font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Event Description & Context</Label>
              <Textarea
                value={unexpectedEvent.description}
                onChange={(e) => onChange({ ...unexpectedEvent, description: e.target.value })}
                placeholder="Explain what unexpected emergency happened mid-project..."
                className="text-xs leading-relaxed"
                rows={3}
              />
            </div>
          </div>

          {/* Decision Choices & Options */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Decision Options for Students
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Configure choices students can select to adapt to this event. Mark the optimal solution.
                </p>
              </div>
              <Button type="button" size="sm" onClick={addOption} className="gap-1 text-xs shrink-0">
                <Plus className="h-3.5 w-3.5" /> Add Option
              </Button>
            </div>

            {options.length === 0 ? (
              <div className="text-center py-6 px-4 border border-dashed border-border rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">No decision options added yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {options.map((opt, i) => (
                  <div
                    key={opt.id || i}
                    className={`p-4 border rounded-lg bg-card space-y-3 transition-all ${
                      opt.isOptimal ? "border-primary/40 bg-primary/5 dark:bg-primary/10 shadow-xs" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          Option {i + 1}
                        </span>
                        {opt.isOptimal ? (
                          <Badge className="bg-primary text-primary-foreground text-[10px] gap-1">
                            <CheckCircle className="h-3 w-3" /> Optimal Path
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            Alternative Choice
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!opt.isOptimal && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setOptimal(i)}
                            className="h-7 text-[11px] text-primary hover:bg-primary/10"
                          >
                            Mark as Optimal
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(i)}
                          title="Delete decision option"
                          className="h-7 text-[11px] gap-1 text-destructive/80 hover:text-destructive hover:bg-destructive/10 px-2 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Option</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Option Text</Label>
                      <Input
                        value={opt.text}
                        onChange={(e) => updateOption(i, "text", e.target.value)}
                        placeholder="Action students can take..."
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Feedback & Outcome Explanation</Label>
                      <Textarea
                        value={opt.feedback}
                        onChange={(e) => updateOption(i, "feedback", e.target.value)}
                        placeholder="Explanation shown to students when they pick this option..."
                        className="text-xs leading-relaxed"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
