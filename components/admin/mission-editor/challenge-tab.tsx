import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UnexpectedEvent } from "@/lib/definitions";

interface ChallengeTabProps {
  unexpectedEvent: UnexpectedEvent;
  onChange: (unexpectedEvent: UnexpectedEvent) => void;
}

export function ChallengeTab({ unexpectedEvent, onChange }: ChallengeTabProps) {
  return (
    <TabsContent value="challenge">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Step 6 Unexpected Challenge Event</CardTitle>
          <CardDescription className="text-xs">Define a mid-simulation disruption event.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Event Title</Label>
            <Input
              value={unexpectedEvent.title}
              onChange={(e) => onChange({ ...unexpectedEvent, title: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Event Description</Label>
            <Textarea
              value={unexpectedEvent.description}
              onChange={(e) => onChange({ ...unexpectedEvent, description: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
