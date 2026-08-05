import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CauseItem } from "@/lib/definitions";

interface CausesTabProps {
  causes: CauseItem[];
  onChange: (causes: CauseItem[]) => void;
}

export function CausesTab({ causes, onChange }: CausesTabProps) {
  const addCause = () => {
    onChange([
      ...causes,
      { id: `c${Date.now()}`, title: "New Contributing Factor", description: "Brief description of this cause." },
    ]);
  };

  const removeCause = (idx: number) => {
    onChange(causes.filter((_, i) => i !== idx));
  };

  const updateCause = (idx: number, field: keyof CauseItem, value: string) => {
    const next = [...causes];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  return (
    <TabsContent value="causes">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-sm">Step 2 Causes</CardTitle>
            <CardDescription className="text-xs">Manage the causes for this mission.</CardDescription>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={addCause} className="gap-1">
            <Plus className="h-4 w-4" /> Add Cause
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {causes.length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-md">
                No causes added yet. Click &quot;Add Cause&quot; to begin.
              </div>
            )}
            {causes.map((c, i) => (
              <div key={c.id || i} className="p-4 border rounded-md space-y-3 bg-card relative flex items-start gap-3 mb-2 shadow-sm">
                <div className="flex-1 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Cause Title</Label>
                    <Input
                      value={c.title}
                      onChange={(e) => updateCause(i, "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Description</Label>
                    <Input
                      value={c.description}
                      onChange={(e) => updateCause(i, "description", e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCause(i)}
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 shrink-0 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
