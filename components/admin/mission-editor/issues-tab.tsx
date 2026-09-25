"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, AlertCircle, FileText, ListOrdered, CheckCircle2, Check } from "lucide-react";
import { Sortable, SortableDragHandle } from "@/components/ui/sortable";
import { IssueOption } from "@/lib/definitions";

interface IssuesTabProps {
  issues: IssueOption[];
  onChange: (issues: IssueOption[]) => void;
}

export function IssuesTab({ issues, onChange }: IssuesTabProps) {
  const [viewMode, setViewMode] = useState<"list" | "raw">("list");
  const [rawText, setRawText] = useState<string>(() =>
    issues.map((i) => i.text).join("\n")
  );

  const addIssue = () => {
    const newIssues: IssueOption[] = [
      ...issues,
      {
        id: `issue-${Date.now()}`,
        text: "",
        isCorrect: issues.length === 0,
      },
    ];
    onChange(newIssues);
  };

  const removeIssue = (index: number) => {
    const wasCorrect = issues[index]?.isCorrect;
    const remaining = issues.filter((_, i) => i !== index);
    if (wasCorrect && remaining.length > 0) {
      remaining[0].isCorrect = true;
    }
    onChange(remaining);
  };

  const updateIssueText = (index: number, newText: string) => {
    const updated = [...issues];
    updated[index] = { ...updated[index], text: newText };
    onChange(updated);
  };

  const setCorrect = (index: number) => {
    const updated = issues.map((item, i) => ({
      ...item,
      isCorrect: i === index,
    }));
    onChange(updated);
  };

  const handleToggleView = () => {
    if (viewMode === "raw") {
      // Parse raw text into issue items, preserving previous correct selection if possible
      const lines = rawText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const parsed: IssueOption[] = lines.map((text, idx) => ({
        id: `issue-${idx}-${Date.now()}`,
        text,
        isCorrect: idx === 0,
      }));
      onChange(parsed);
      setViewMode("list");
    } else {
      setRawText(issues.map((i) => i.text).join("\n"));
      setViewMode("raw");
    }
  };

  const handleRawChange = (text: string) => {
    setRawText(text);
    const lines = text
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsed: IssueOption[] = lines.map((t, idx) => ({
      id: `issue-${idx}-${Date.now()}`,
      text: t,
      isCorrect: idx === 0,
    }));
    onChange(parsed);
  };

  const correctItem = issues.find((i) => i.isCorrect);

  return (
    <TabsContent value="issues" className="m-0 w-full">
      <Card className="w-full border border-border shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary shrink-0" />
                <span>Step 1: Priority Issue Choices</span>
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                {issues.length} Options
              </Badge>
              {correctItem && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono shrink-0 gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Correct Answer Designated
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              Define the candidate issue options for Step 1 (&quot;What is the main issue that needs to be addressed first?&quot;).
              Tick or mark the correct root issue that students should prioritize.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleToggleView}
              className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            >
              {viewMode === "list" ? (
                <>
                  <FileText className="h-3.5 w-3.5" /> Raw Text
                </>
              ) : (
                <>
                  <ListOrdered className="h-3.5 w-3.5" /> Interactive Cards
                </>
              )}
            </Button>
            {viewMode === "list" && (
              <Button type="button" size="sm" onClick={addIssue} className="gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Issue
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {viewMode === "raw" ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Enter one issue choice per line. The first line will default to the correct answer:
              </p>
              <Textarea
                value={rawText}
                onChange={(e) => handleRawChange(e.target.value)}
                rows={6}
                className="font-mono text-xs leading-relaxed"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {issues.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg bg-muted/30 space-y-2">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground/60" />
                  <p className="text-xs text-muted-foreground font-medium">No priority issues added yet.</p>
                  <Button type="button" size="sm" variant="outline" onClick={addIssue} className="text-xs gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add First Issue
                  </Button>
                </div>
              ) : (
                <Sortable
                  items={issues}
                  onValueChange={onChange}
                  renderItem={(item, index) => (
                    <div
                      key={item.id || index}
                      className={`p-3 border rounded-lg bg-card space-y-2.5 transition-all shadow-xs ${
                        item.isCorrect
                          ? "border-primary/50 bg-primary/5 dark:bg-primary/10 shadow-xs ring-1 ring-primary/20"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <SortableDragHandle />

                          {/* Direct Tick / Radio Button */}
                          <button
                            type="button"
                            onClick={() => setCorrect(index)}
                            aria-label={item.isCorrect ? "Correct answer" : "Mark as correct answer"}
                            className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                              item.isCorrect
                                ? "border-primary bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/20"
                                : "border-muted-foreground/40 hover:border-primary text-transparent"
                            }`}
                            title={item.isCorrect ? "Correct answer" : "Click to mark as correct answer"}
                          >
                            <Check className="h-3 w-3 stroke-[3]" />
                          </button>

                          <span className="font-mono text-xs font-bold text-muted-foreground">
                            Option {index + 1}
                          </span>

                          {item.isCorrect ? (
                            <Badge className="bg-primary text-primary-foreground text-[10px] gap-1 font-semibold">
                              <CheckCircle2 className="h-3 w-3" /> Correct Answer
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              Alternative Choice
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {!item.isCorrect && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setCorrect(index)}
                              className="h-7 text-[11px] text-primary hover:bg-primary/10 gap-1 border-primary/30 hover:border-primary"
                            >
                              <CheckCircle2 className="h-3 w-3" /> Mark as Correct Answer
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeIssue(index)}
                            title="Remove issue"
                            className="h-7 w-7 shrink-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="pl-6">
                        <Input
                          value={item.text}
                          onChange={(e) => updateIssueText(index, e.target.value)}
                          className={`text-xs bg-background ${item.isCorrect ? "font-medium" : ""}`}
                        />
                      </div>
                    </div>
                  )}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
