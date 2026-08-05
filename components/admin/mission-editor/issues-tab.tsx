import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface IssuesTabProps {
  issuesText: string;
  onChange: (issuesText: string) => void;
}

export function IssuesTab({ issuesText, onChange }: IssuesTabProps) {
  return (
    <TabsContent value="issues">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Step 1 Priority Issue Choices</CardTitle>
          <CardDescription className="text-xs">Enter one priority issue per line.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={issuesText}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            className="font-mono text-xs"
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
