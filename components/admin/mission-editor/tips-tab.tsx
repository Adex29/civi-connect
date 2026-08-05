import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface TipsTabProps {
  stepTips: Record<number, string>;
  onChange: (stepTips: Record<number, string>) => void;
}

export function TipsTab({ stepTips, onChange }: TipsTabProps) {
  return (
    <TabsContent value="tips">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Custom Mission Tips per Step</CardTitle>
          <CardDescription className="text-xs">Provide contextual guidance for each step of the simulation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div key={num} className="flex items-center gap-3">
              <span className="font-mono font-bold w-12 text-xs text-muted-foreground">Step {num}:</span>
              <Input
                value={stepTips[num] || ""}
                onChange={(e) => onChange({ ...stepTips, [num]: e.target.value })}
                className="flex-1"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
