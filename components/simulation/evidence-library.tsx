"use client";

import React, { useState } from "react";
import { Star, Check, FileText, Image as ImageIcon, MessageSquare, BarChart, MapPin, Globe, CheckSquare, Square } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { EvidenceItem } from "@/lib/definitions";

export interface EvaluatedEvidence {
  evidenceId: string;
  userCredibility: number;
  selectedSupports: ("cause" | "solution" | "need")[];
  justification: string;
}

export interface EvidenceLibraryProps {
  items: EvidenceItem[];
  evaluated: EvaluatedEvidence[];
  onUpdateEvaluated: (evaluations: EvaluatedEvidence[]) => void;
  disabled?: boolean;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  "Government Report": <FileText className="h-5 w-5 text-blue-500" />,
  "Community Survey": <BarChart className="h-5 w-5 text-emerald-500" />,
  "Article Photo": <ImageIcon className="h-5 w-5 text-purple-500" />,
  "Interview": <MessageSquare className="h-5 w-5 text-amber-500" />,
  "Budget Report": <BarChart className="h-5 w-5 text-green-600" />,
  "Social Media": <Globe className="h-5 w-5 text-rose-500" />,
  "Survey News": <FileText className="h-5 w-5 text-cyan-500" />,
  "Map": <MapPin className="h-5 w-5 text-indigo-500" />,
};

export function EvidenceLibrary({ items, evaluated, onUpdateEvaluated, disabled }: EvidenceLibraryProps) {
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);

  // Inspector form state
  const [credibility, setCredibility] = useState(3);
  const [supports, setSupports] = useState<("cause" | "solution" | "need")[]>([]);
  const [justification, setJustification] = useState("");

  const openInspector = (item: EvidenceItem) => {
    setSelectedItem(item);
    const existing = evaluated.find((e) => e.evidenceId === item.id);
    if (existing) {
      setCredibility(existing.userCredibility);
      setSupports(existing.selectedSupports);
      setJustification(existing.justification);
    } else {
      setCredibility(item.defaultCredibility || 3);
      setSupports([]);
      setJustification("");
    }
  };

  const saveEvaluation = () => {
    if (!selectedItem) return;
    const updated = evaluated.filter((e) => e.evidenceId !== selectedItem.id);
    updated.push({
      evidenceId: selectedItem.id,
      userCredibility: credibility,
      selectedSupports: supports,
      justification,
    });
    onUpdateEvaluated(updated);
    setSelectedItem(null);
  };

  const toggleSupport = (tag: "cause" | "solution" | "need") => {
    if (supports.includes(tag)) {
      setSupports(supports.filter((t) => t !== tag));
    } else {
      setSupports([...supports, tag]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Evidence Sources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const evalData = evaluated.find((e) => e.evidenceId === item.id);

          return (
            <Card
              key={item.id}
              onClick={() => openInspector(item)}
              className={`cursor-pointer transition-all duration-200 border hover:shadow-md hover:border-primary/50 relative overflow-hidden flex flex-col justify-between ${
                evalData ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20" : "hover:bg-muted/20"
              }`}
            >
              {evalData && (
                <div className="absolute top-2.5 right-2.5 bg-primary text-primary-foreground p-1 rounded-full text-xs shadow-xs z-10">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}

              {/* Photo Evidence Header Banner if imageUrl exists */}
              {item.imageUrl && (
                <div className="relative h-32 w-full overflow-hidden bg-muted border-b">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" /> Photo Evidence
                  </span>
                </div>
              )}

              <CardContent className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                      {item.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>

                <div className="pt-2.5 border-t flex items-center justify-between text-xs font-medium mt-2">
                  {evalData ? (
                    <>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < evalData.userCredibility ? "fill-amber-500 text-amber-500" : "text-slate-300 dark:text-slate-700"}`}
                          />
                        ))}
                      </div>
                      <span className="text-primary text-[11px] font-bold">Evaluated</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground text-[11px] italic">Click to Inspect Source →</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Items Summary */}
      <div className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between bg-muted/30 p-3 rounded-lg border gap-1">
        <span>
          Evaluated Evidence Count: <strong>{evaluated.length}</strong> of {items.length}
        </span>
        <span className="italic text-[11px]">Click any item to inspect & assess credibility</span>
      </div>

      {/* Evidence Inspector Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="sm:max-w-[550px] max-w-[92vw] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {selectedItem.type}
                </span>
              </div>
              <DialogTitle className="text-base sm:text-lg leading-snug">{selectedItem.title}</DialogTitle>
              <DialogDescription className="text-xs">Read the evidence details and complete your evaluation.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Photo Evidence View if imageUrl exists */}
              {selectedItem.imageUrl && (
                <div className="space-y-1.5">
                  <span className="font-bold text-xs uppercase text-primary flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" /> Photo Evidence Attachment:
                  </span>
                  <div className="relative w-full overflow-hidden rounded-lg border bg-muted group">
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      className="w-full max-h-64 object-cover rounded-md"
                    />
                  </div>
                </div>
              )}

              {/* Photo / Content Preview Box */}
              <div className="p-3 sm:p-4 bg-muted/40 rounded-lg border text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                <span className="font-bold text-xs uppercase text-primary block mb-1">Source Content:</span>
                "{selectedItem.fullText}"
              </div>

              {/* Star Rating for Source Credibility */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold block">How credible is this source?</label>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => !disabled && setCredibility(starVal)}
                        className="p-1 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`h-5 w-5 sm:h-6 sm:w-6 ${
                            starVal <= credibility
                              ? "fill-amber-500 text-amber-500"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-muted-foreground ml-2">
                    {credibility} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Checkboxes for Evidence Scope */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold block">Does it support the following?</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "cause", label: "Cause" },
                    { key: "solution", label: "Solution" },
                    { key: "need", label: "Community Need" },
                  ].map((t) => {
                    const isChecked = supports.includes(t.key as any);
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => !disabled && toggleSupport(t.key as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          isChecked
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        {isChecked ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Justification Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold block">Justify your evaluation (2-3 complete sentences):</label>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Explain why this evidence is credible and how it connects to the community issue..."
                  className="min-h-[90px]"
                  disabled={disabled}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>
              <Button onClick={saveEvaluation} disabled={disabled || !justification.trim()}>
                Save Evaluation
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
