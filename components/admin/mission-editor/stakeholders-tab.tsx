import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Stakeholder } from "@/lib/definitions";

interface StakeholdersTabProps {
  stakeholders: Stakeholder[];
  onChange: (stakeholders: Stakeholder[]) => void;
}

export function StakeholdersTab({ stakeholders, onChange }: StakeholdersTabProps) {
  const addStakeholder = () => {
    onChange([
      ...stakeholders,
      {
        id: `st${Date.now()}`,
        name: "New Stakeholder",
        role: "Community Representative",
        initialStatement: "Initial statement in the simulation...",
        followUps: [{ question: "What is your main concern?", answer: "We want clear guidelines and assistance." }],
      },
    ]);
  };

  const removeStakeholder = (idx: number) => {
    onChange(stakeholders.filter((_, i) => i !== idx));
  };

  const updateStakeholder = (idx: number, field: keyof Stakeholder, value: string) => {
    const next = [...stakeholders];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  return (
    <TabsContent value="stakeholders">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-sm">Step 4 Stakeholders</CardTitle>
            <CardDescription className="text-xs">Manage the stakeholders.</CardDescription>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={addStakeholder} className="gap-1">
            <Plus className="h-4 w-4" /> Add Stakeholder
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stakeholders.length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-md">
                No stakeholders added yet. Click &quot;Add Stakeholder&quot; to begin.
              </div>
            )}
            {stakeholders.map((s, i) => (
              <div key={s.id || i} className="p-4 border rounded-md space-y-3 bg-card relative flex items-start gap-3 mb-2 shadow-sm">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Name</Label>
                      <Input
                        value={s.name}
                        onChange={(e) => updateStakeholder(i, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Role</Label>
                      <Input
                        value={s.role}
                        onChange={(e) => updateStakeholder(i, "role", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Initial Statement</Label>
                    <Input
                      value={s.initialStatement}
                      onChange={(e) => updateStakeholder(i, "initialStatement", e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStakeholder(i)}
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
