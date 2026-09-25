"use client";

import { useState, useMemo } from "react";
import { Classroom, Scenario, Student, Submission } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MultiSelectCombobox, ComboboxOption } from "@/components/ui/combobox";
import { SubmissionDrawer } from "./submission-drawer";
import { format } from "date-fns";
import {
  CheckCircle,
  Clock,
  Search,
  School,
  LayoutGrid,
  List,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { extractSubmissionAiAnalysis } from "@/lib/flag-utils";

interface SubmissionsViewProps {
  submissions: Submission[];
  students: Student[];
  scenarios: Scenario[];
  classrooms: Classroom[];
}

interface GroupSection {
  label: string;
  code?: string;
  items: Array<{
    sub: Submission;
    student: Student | undefined;
    scenario: Scenario | undefined;
    classroom: Classroom | undefined;
    aiAnalysis: ReturnType<typeof extractSubmissionAiAnalysis>;
  }>;
}

export function SubmissionsView({
  submissions,
  students,
  scenarios,
  classrooms,
}: SubmissionsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress" | "ai_flagged" | "verified">("all");
  const [groupBy, setGroupBy] = useState<"flat" | "classroom" | "scenario">("flat");

  // Combobox options
  const classroomOptions = useMemo<ComboboxOption[]>(() => {
    return classrooms.map((c) => ({
      value: c.id,
      label: c.name,
      sublabel: `Code: ${c.code}`,
    }));
  }, [classrooms]);

  const scenarioOptions = useMemo<ComboboxOption[]>(() => {
    return scenarios.map((s) => ({
      value: s.id,
      label: s.title,
    }));
  }, [scenarios]);

  // Enriched items mapping with AI analysis
  const enrichedSubmissions = useMemo(() => {
    return submissions
      .map((sub) => {
        const student = students.find((s) => s.id === sub.studentId);
        const scenario = scenarios.find((s) => s.id === sub.scenarioId);
        const classroom = classrooms.find((c) => c.id === student?.classroomId);
        const aiAnalysis = extractSubmissionAiAnalysis(sub);
        return { sub, student, scenario, classroom, aiAnalysis };
      })
      .filter((item) => item.student && item.scenario);
  }, [submissions, students, scenarios, classrooms]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = enrichedSubmissions.length;
    const completed = enrichedSubmissions.filter((item) => item.sub.status === "completed").length;
    const inProgress = total - completed;
    const aiFlagged = enrichedSubmissions.filter((item) => item.aiAnalysis.hasAiFlag).length;
    const verified = enrichedSubmissions.filter(
      (item) => !item.aiAnalysis.hasAiFlag && item.aiAnalysis.totalEvaluatedSteps > 0
    ).length;
    return { total, completed, inProgress, aiFlagged, verified };
  }, [enrichedSubmissions]);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return enrichedSubmissions.filter(({ sub, student, scenario, classroom, aiAnalysis }) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = student?.fullName.toLowerCase().includes(query);
        const matchesLrn = student?.lrn.includes(query);
        const matchesScenario = scenario?.title.toLowerCase().includes(query);
        if (!matchesName && !matchesLrn && !matchesScenario) return false;
      }

      if (selectedClassrooms.length > 0) {
        if (!classroom || !selectedClassrooms.includes(classroom.id)) return false;
      }

      if (selectedScenarios.length > 0) {
        if (!scenario || !selectedScenarios.includes(scenario.id)) return false;
      }

      if (statusFilter === "completed" && sub.status !== "completed") return false;
      if (statusFilter === "in_progress" && sub.status === "completed") return false;
      if (statusFilter === "ai_flagged" && !aiAnalysis.hasAiFlag) return false;
      if (statusFilter === "verified" && (aiAnalysis.hasAiFlag || aiAnalysis.totalEvaluatedSteps === 0)) return false;

      return true;
    });
  }, [enrichedSubmissions, searchQuery, selectedClassrooms, selectedScenarios, statusFilter]);

  // Grouped datasets
  const groupedData = useMemo<Array<[string, GroupSection]>>(() => {
    if (groupBy === "classroom") {
      const groups: Record<string, GroupSection> = {};
      filteredSubmissions.forEach((item) => {
        const key = item.classroom?.id || "unassigned";
        const label = item.classroom?.name || "Unassigned Classroom";
        const code = item.classroom?.code;
        if (!groups[key]) groups[key] = { label, code, items: [] };
        groups[key].items.push(item);
      });
      return Object.entries(groups);
    }

    if (groupBy === "scenario") {
      const groups: Record<string, GroupSection> = {};
      filteredSubmissions.forEach((item) => {
        const key = item.scenario?.id || "unknown";
        const label = item.scenario?.title || "Unknown Mission";
        if (!groups[key]) groups[key] = { label, items: [] };
        groups[key].items.push(item);
      });
      return Object.entries(groups);
    }

    return [];
  }, [filteredSubmissions, groupBy]);

  const renderCard = (item: typeof enrichedSubmissions[0]) => {
    const { sub, student, scenario, classroom, aiAnalysis } = item;
    if (!student || !scenario) return null;

    const studentWorkPreview = sub.simulationState?.step5?.plan?.projectTitle
      ? `Intervention Plan: "${sub.simulationState.step5.plan.projectTitle}" (Goal: ${sub.simulationState.step5.plan.goal || "In progress"})`
      : sub.simulationState?.step1?.selectedIssue
      ? `Priority Issue: "${sub.simulationState.step1.selectedIssue}" — ${sub.simulationState.step1.justification || ""}`
      : sub.content && !sub.content.startsWith("{")
      ? sub.content
      : "Simulation in progress...";

    return (
      <Card key={sub.id} className="overflow-hidden border shadow-xs hover:border-primary/40 transition-all">
        <CardHeader className="bg-muted/40 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              <CardTitle className="text-lg sm:text-xl flex items-start gap-2 leading-snug break-words">
                {sub.status === "completed" ? (
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <span className="font-semibold text-foreground">{scenario.title}</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm font-medium text-foreground/80 flex flex-wrap items-center gap-1.5">
                <span>
                  Submitted by <strong>{student.fullName}</strong>
                </span>
                <span className="text-muted-foreground font-mono">({student.lrn})</span>
                {student.groupId && <Badge variant="outline" className="text-xs">Group {student.groupId}</Badge>}
                {classroom && <Badge variant="secondary" className="text-xs">{classroom.name}</Badge>}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              {/* AI Verification Badge */}
              {aiAnalysis.hasAiFlag ? (
                <Badge variant="destructive" className="gap-1 font-bold text-xs">
                  <ShieldAlert className="h-3.5 w-3.5" /> AI Flagged (Step {aiAnalysis.flaggedSteps.join(", ")})
                </Badge>
              ) : sub.status === "completed" ? (
                <Badge
                  variant="outline"
                  className="gap-1 font-semibold text-xs text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified Voice
                </Badge>
              ) : aiAnalysis.totalEvaluatedSteps > 0 ? (
                <Badge variant="outline" className="gap-1 text-xs text-primary border-primary/30">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {aiAnalysis.totalEvaluatedSteps} Steps Evaluated
                </Badge>
              ) : null}

              <Badge variant={sub.status === "completed" ? "default" : "secondary"}>
                {sub.status.toUpperCase()}
              </Badge>
              <SubmissionDrawer
                submission={sub}
                student={student}
                scenario={scenario}
                classroom={classroom}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 pb-3 space-y-3">
          {/* Student Work Preview */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Student Work Preview
            </h4>
            <div className="text-xs text-foreground bg-muted/30 px-3 py-2 rounded-md border flex items-center gap-2 overflow-hidden">
              <span className="truncate flex-1 font-medium font-mono text-[11px]">
                {studentWorkPreview}
              </span>
            </div>
          </div>

          {/* Captured AI Evaluation & Feedback Response */}
          {aiAnalysis.latestFeedback && (
            <div
              className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                aiAnalysis.hasAiFlag
                  ? "bg-rose-500/10 border-rose-500/35 text-rose-950 dark:text-rose-200"
                  : "bg-primary/5 border-primary/20 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-[11px]">
                <span className="flex items-center gap-1.5">
                  {aiAnalysis.hasAiFlag ? (
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                  Latest AI Evaluation Response {aiAnalysis.latestStepEvaluated ? `(Step 0${aiAnalysis.latestStepEvaluated})` : ""}
                </span>
                {aiAnalysis.latestScore !== undefined && (
                  <span
                    className={`font-mono px-1.5 py-0.5 rounded text-[10px] ${
                      aiAnalysis.latestScore >= 70
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold"
                        : "bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold"
                    }`}
                  >
                    Step Score: {aiAnalysis.latestScore}%
                  </span>
                )}
              </div>
              <p className="line-clamp-2 text-muted-foreground italic leading-relaxed">
                &ldquo;{aiAnalysis.latestFeedback}&rdquo;
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-muted/40 py-3 text-xs text-muted-foreground flex flex-wrap justify-between items-center gap-2 border-t">
          <span>Last active: {format(new Date(sub.submittedAt), "MMMM d, yyyy h:mm a")}</span>
          <div className="flex items-center gap-3">
            {sub.stepProgress && sub.status !== "completed" && (
              <span className="font-medium text-muted-foreground">Progress: Step {Math.min(sub.stepProgress, 7)}/7</span>
            )}
            {sub.score !== null && sub.score !== undefined && (
              <span className="font-bold text-foreground bg-primary/10 px-2 py-0.5 rounded">
                Overall Civic Score: {sub.score}%
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="page-title text-4xl">Submissions Viewer</h2>
          <p className="text-muted-foreground mt-1">
            Review student civic action plans and inspect detailed AI evaluation results, scoring diagnostics, and authenticity logs.
          </p>
        </div>
      </div>

      {/* Filter Tabs / Quick Stats Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            statusFilter === "all"
              ? "bg-primary text-primary-foreground font-bold shadow-xs"
              : "bg-muted/50 hover:bg-muted text-muted-foreground"
          }`}
        >
          All Submissions <Badge variant="secondary" className="text-[10px] px-1 py-0">{stats.total}</Badge>
        </button>
        <button
          onClick={() => setStatusFilter("ai_flagged")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            statusFilter === "ai_flagged"
              ? "bg-rose-600 text-white font-bold shadow-xs"
              : stats.aiFlagged > 0
              ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/20"
              : "bg-muted/50 hover:bg-muted text-muted-foreground"
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          AI Content Flagged
          <Badge
            variant={statusFilter === "ai_flagged" ? "outline" : "destructive"}
            className="text-[10px] px-1.5 py-0 font-mono"
          >
            {stats.aiFlagged}
          </Badge>
        </button>
        <button
          onClick={() => setStatusFilter("verified")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            statusFilter === "verified"
              ? "bg-emerald-600 text-white font-bold shadow-xs"
              : "bg-muted/50 hover:bg-muted text-muted-foreground"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Verified Voice <Badge variant="secondary" className="text-[10px] px-1 py-0">{stats.verified}</Badge>
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            statusFilter === "completed"
              ? "bg-primary text-primary-foreground font-bold shadow-xs"
              : "bg-muted/50 hover:bg-muted text-muted-foreground"
          }`}
        >
          Completed <Badge variant="secondary" className="text-[10px] px-1 py-0">{stats.completed}</Badge>
        </button>
        <button
          onClick={() => setStatusFilter("in_progress")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            statusFilter === "in_progress"
              ? "bg-primary text-primary-foreground font-bold shadow-xs"
              : "bg-muted/50 hover:bg-muted text-muted-foreground"
          }`}
        >
          In Progress <Badge variant="secondary" className="text-[10px] px-1 py-0">{stats.inProgress}</Badge>
        </button>
      </div>

      {/* Clean toolbar */}
      <div className="toolbar-panel flex flex-col items-stretch justify-between gap-3 rounded-xl p-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, LRN, or mission..."
            className="pl-9 text-xs h-10"
          />
        </div>

        {/* Filters & Organization */}
        <div className="grid min-w-0 gap-2 text-xs sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
          <div className="min-w-0 lg:w-[200px]">
            <MultiSelectCombobox
              options={classroomOptions}
              selectedValues={selectedClassrooms}
              onSelectChange={setSelectedClassrooms}
              placeholder="Filter Classrooms..."
              searchPlaceholder="Search classrooms..."
              emptyText="No classrooms found."
            />
          </div>

          <div className="min-w-0 lg:w-[200px]">
            <MultiSelectCombobox
              options={scenarioOptions}
              selectedValues={selectedScenarios}
              onSelectChange={setSelectedScenarios}
              placeholder="Filter Missions..."
              searchPlaceholder="Search missions..."
              emptyText="No missions found."
            />
          </div>

          {/* Grouping toggles */}
          <div className="toolbar-control-group flex items-center gap-1 p-1 sm:col-span-2 lg:ml-1">
            <button
              onClick={() => setGroupBy("flat")}
              data-selected={groupBy === "flat"}
              className="toolbar-toggle rounded-md p-2 transition-all"
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setGroupBy("classroom")}
              data-selected={groupBy === "classroom"}
              className="toolbar-toggle rounded-md p-2 transition-all"
              title="Group by Classroom"
            >
              <School className="h-4 w-4" />
            </button>
            <button
              onClick={() => setGroupBy("scenario")}
              data-selected={groupBy === "scenario"}
              className="toolbar-toggle rounded-md p-2 transition-all"
              title="Group by Mission"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {groupBy === "flat" ? (
        <div className="grid gap-6">
          {filteredSubmissions.map((item) => renderCard(item))}

          {filteredSubmissions.length === 0 && (
            <div className="py-12 text-center border rounded-lg border-dashed">
              <h3 className="text-lg font-medium">No matching submissions found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search terms or active filters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {groupedData.map(([groupId, { label, code, items }]) => (
            <div key={groupId} className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight">{label}</h3>
                  {code && <Badge variant="outline" className="font-mono text-xs">Code: {code}</Badge>}
                  <Badge variant="secondary" className="text-xs">
                    {items.length} {items.length === 1 ? "submission" : "submissions"}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                {items.map((item) => renderCard(item))}
              </div>
            </div>
          ))}

          {groupedData.length === 0 && (
            <div className="py-12 text-center border rounded-lg border-dashed">
              <h3 className="text-lg font-medium">No matching submissions found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search terms or active filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
