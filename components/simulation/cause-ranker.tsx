"use client";

import React, { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CauseItem } from "@/lib/definitions";
import { Sortable, SortableDragHandle } from "@/components/ui/sortable";

export interface CauseRankerProps {
  initialCauses: CauseItem[];
  onOrderChange: (orderedIds: string[]) => void;
  disabled?: boolean;
}

export function CauseRanker({ initialCauses, onOrderChange, disabled }: CauseRankerProps) {
  const [causes, setCauses] = useState<CauseItem[]>(initialCauses);

  const moveItem = (index: number, direction: "up" | "down") => {
    if (disabled) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= causes.length) return;

    const updated = [...causes];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);

    setCauses(updated);
    onOrderChange(updated.map((c) => c.id));
  };

  const handleSortChange = (newCauses: CauseItem[]) => {
    if (disabled) return;
    setCauses(newCauses);
    onOrderChange(newCauses.map((c) => c.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold uppercase tracking-wider px-1">
        <span className="flex items-center gap-1 text-primary font-bold">
          <ArrowUp className="h-3.5 w-3.5" /> #1 Most Significant Cause
        </span>
        <span className="flex items-center gap-1">
          Least Significant <ArrowDown className="h-3.5 w-3.5" />
        </span>
      </div>

      <Sortable
        items={causes}
        onValueChange={handleSortChange}
        renderItem={(cause, index) => (
          <Card
            className={`transition-all duration-200 border shadow-xs ${
              index === 0 ? "border-primary/40 bg-primary/5" : "hover:border-primary/20"
            }`}
          >
            <CardContent className="p-3 flex items-center gap-3">
              {!disabled && <SortableDragHandle className="shrink-0" />}

              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                #{index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">{cause.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">{cause.description}</p>
              </div>

              {!disabled && (
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    disabled={index === 0}
                    onClick={() => moveItem(index, "up")}
                    title="Move Up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    disabled={index === causes.length - 1}
                    onClick={() => moveItem(index, "down")}
                    title="Move Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      />
    </div>
  );
}
