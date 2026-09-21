"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, AlertCircle, FileText, ListOrdered } from "lucide-react";
import { Sortable, SortableDragHandle } from "@/components/ui/sortable";
import { Textarea } from "@/components/ui/textarea";

interface IssuesTabProps {
  issuesText: string;
  onChange: (issuesText: string) => void;
}

interface IssueItem {
  id: string;
  text: string;
}

export function IssuesTab({ issuesText, onChange }: IssuesTabProps) {
  const [viewMode, setViewMode] = useState<"list" | "raw">("list");

  // Parse lines into object array for drag and drop
  const lines = issuesText
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const [items, setItems] = useState<IssueItem[]>(() =>
    lines.map((text, index) => ({
      id: `issue-${index}-${text.slice(0, 10)}`,
      text,
    }))
  );

  const updateFromItems = (newItems: IssueItem[]) => {
    setItems(newItems);
    const text = newItems.map((i) => i.text.trim()).filter(Boolean).join("\n");
    onChange(text);
  };

  const addItem = () => {
    const newItems = [...items, { id: `issue-${Date.now()}`, text: "" }];
    updateFromItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateFromItems(newItems);
  };

  const updateItemText = (index: number, newText: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], text: newText };
    updateFromItems(newItems);
  };

  const handleToggleView = () => {
    if (viewMode === "raw") {
      const parsed = issuesText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((text, idx) => ({ id: `issue-${idx}-${text.slice(0, 10)}`, text }));
      setItems(parsed);
      setViewMode("list");
    } else {
      setViewMode("raw");
    }
  };

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
                {items.length} Options
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Define the candidate problem statements that students will analyze and prioritize in Step 1.
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
              <Button type="button" size="sm" onClick={addItem} className="gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Issue
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {viewMode === "raw" ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Enter one issue choice per line:</p>
              <Textarea
                value={issuesText}
                onChange={(e) => onChange(e.target.value)}
                rows={6}
                className="font-mono text-xs leading-relaxed"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg bg-muted/30 space-y-2">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground/60" />
                  <p className="text-xs text-muted-foreground font-medium">No priority issues added yet.</p>
                  <Button type="button" size="sm" variant="outline" onClick={addItem} className="text-xs gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add First Issue
                  </Button>
                </div>
              ) : (
                <Sortable
                  items={items}
                  onValueChange={updateFromItems}
                  renderItem={(item, index) => (
                    <div className="flex items-center gap-2 p-2.5 bg-card border border-border rounded-lg shadow-xs hover:border-primary/40 transition-colors">
                      <SortableDragHandle />
                      <span className="font-mono text-xs font-bold text-muted-foreground w-6 text-center shrink-0">
                        #{index + 1}
                      </span>
                      <Input
                        value={item.text}
                        onChange={(e) => updateItemText(index, e.target.value)}
                        className="flex-1 text-xs h-8 bg-background"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem(index)}
                        title="Remove issue"
                        className="h-8 w-8 shrink-0 border border-transparent text-destructive/80 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 hover:shadow-md transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
