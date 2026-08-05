import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { EvidenceItem } from "@/lib/definitions";

export const EVIDENCE_TYPE_OPTIONS: ComboboxOption[] = [
  { value: "Government Report", label: "Government Report", sublabel: "Official municipal & agency reports" },
  { value: "Article Photo", label: "Article Photo", sublabel: "Photo evidence & visual documentation" },
  { value: "Community Survey", label: "Community Survey", sublabel: "Local household & resident feedback" },
  { value: "Survey News", label: "Survey News", sublabel: "News coverage of community surveys" },
  { value: "Interview", label: "Interview", sublabel: "Transcripts with key informants" },
  { value: "Budget Report", label: "Budget Report", sublabel: "Barangay fiscal statements" },
  { value: "Map", label: "Map", sublabel: "Spatial & geographic hazard maps" },
  { value: "Social Media", label: "Social Media", sublabel: "Public posts & community concerns" },
  { value: "News Article", label: "News Article", sublabel: "Journalistic reports & investigations" },
];

interface EvidenceTabProps {
  evidence: EvidenceItem[];
  onChange: (evidence: EvidenceItem[]) => void;
}

export function EvidenceTab({ evidence, onChange }: EvidenceTabProps) {
  const addEvidence = () => {
    onChange([
      ...evidence,
      {
        id: `ev${Date.now()}`,
        title: "New Digital Evidence Source",
        type: "Government Report",
        snippet: "Short preview snippet...",
        fullText: "Full body text of the evidence document...",
        defaultCredibility: 4,
        supports: ["cause", "need"],
      },
    ]);
  };

  const removeEvidence = (idx: number) => {
    onChange(evidence.filter((_, i) => i !== idx));
  };

  const updateEvidence = (idx: number, field: keyof EvidenceItem, value: any) => {
    const next = [...evidence];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  return (
    <TabsContent value="evidence">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-sm">Step 3 Digital Evidence Items</CardTitle>
            <CardDescription className="text-xs">Manage the evidence library.</CardDescription>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={addEvidence} className="gap-1">
            <Plus className="h-4 w-4" /> Add Evidence
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {evidence.length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-md">
                No evidence items added yet. Click &quot;Add Evidence&quot; to begin.
              </div>
            )}
            {evidence.map((ev, i) => (
              <div key={ev.id || i} className="p-4 border rounded-md space-y-3 bg-card relative flex items-start gap-3 mb-2 shadow-sm">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Title</Label>
                      <Input
                        value={ev.title}
                        onChange={(e) => updateEvidence(i, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold block">Type</Label>
                      <Combobox
                        options={
                          ev.type && !EVIDENCE_TYPE_OPTIONS.some((o) => o.value === ev.type)
                            ? [{ value: ev.type, label: ev.type }, ...EVIDENCE_TYPE_OPTIONS]
                            : EVIDENCE_TYPE_OPTIONS
                        }
                        value={ev.type}
                        onValueChange={(val) => updateEvidence(i, "type", val)}
                        placeholder="Select evidence type..."
                        searchPlaceholder="Search types..."
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Snippet preview</Label>
                    <Input
                      value={ev.snippet}
                      onChange={(e) => updateEvidence(i, "snippet", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Full Content text</Label>
                    <Textarea
                      value={ev.fullText}
                      onChange={(e) => updateEvidence(i, "fullText", e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">Photo / Image Attachment URL (Optional)</Label>
                      {ev.imageUrl && <span className="text-[10px] text-emerald-600 font-bold">✓ Photo Attached</span>}
                    </div>
                    <Input
                      placeholder="https://images.unsplash.com/... or data:image/..."
                      value={ev.imageUrl || ""}
                      onChange={(e) => updateEvidence(i, "imageUrl", e.target.value)}
                    />
                    {ev.imageUrl && (
                      <div className="mt-2 h-24 w-40 overflow-hidden rounded-md border shadow-sm relative bg-muted">
                        <img src={ev.imageUrl} alt="Photo Evidence preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEvidence(i)}
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
