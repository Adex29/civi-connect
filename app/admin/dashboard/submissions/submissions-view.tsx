"use client";

import { useState, useMemo } from "react";
import { Classroom, Scenario, Student, Submission } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MultiSelectCombobox, ComboboxOption } from "@/components/ui/combobox";
import { SubmissionDrawer } from "./submission-drawer";
import { format } from "date-fns";
import { CheckCircle, Clock, Search, School, LayoutGrid, List } from "lucide-react";

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
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "draft">("all");
  const [groupBy, setGroupBy] = useState<"flat" | "classroom" | "scenario">("flat");

  // Combobox options
  const classroomOptions = useMemo<ComboboxOption[]>(() => {
    return classrooms.map(c => ({
      value: c.id,
      label: c.name,
      sublabel: `Code: ${c.code}`,
    }));
  }, [classrooms]);

  const scenarioOptions = useMemo<ComboboxOption[]>(() => {
    return scenarios.map(s => ({
      value: s.id,
      label: s.title,
    }));
  }, [scenarios]);

  // Enriched items mapping
  const enrichedSubmissions = useMemo(() => {
    return submissions.map(sub => {
      const student = students.find(s => s.id === sub.studentId);
      const scenario = scenarios.find(s => s.id === sub.scenarioId);
      const classroom = classrooms.find(c => c.id === student?.classroomId);
      return { sub, student, scenario, classroom };
    }).filter(item => item.student && item.scenario);
  }, [submissions, students, scenarios, classrooms]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = enrichedSubmissions.length;
    const completed = enrichedSubmissions.filter(item => item.sub.status === "completed").length;
    const inProgress = total - completed;
    return { total, completed, inProgress };
  }, [enrichedSubmissions]);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return enrichedSubmissions.filter(({ sub, student, scenario, classroom }) => {
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
      if (statusFilter === "draft" && sub.status === "completed") return false;

      return true;
    });
  }, [enrichedSubmissions, searchQuery, selectedClassrooms, selectedScenarios, statusFilter]);

  // Grouped datasets
  const groupedData = useMemo<Array<[string, GroupSection]>>(() => {
    if (groupBy === "classroom") {
      const groups: Record<string, GroupSection> = {};
      filteredSubmissions.forEach(item => {
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
      filteredSubmissions.forEach(item => {
        const key = item.scenario?.id || "unknown";
        const label = item.scenario?.title || "Unknown Scenario";
        if (!groups[key]) groups[key] = { label, items: [] };
        groups[key].items.push(item);
      });
      return Object.entries(groups);
    }

    return [];
  }, [filteredSubmissions, groupBy]);

  const renderCard = (item: typeof enrichedSubmissions[0]) => {
    const { sub, student, scenario, classroom } = item;
    if (!student || !scenario) return null;

    return (
      <Card key={sub.id} className="overflow-hidden">
        <CardHeader className="bg-muted/40 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              <CardTitle className="text-lg sm:text-xl flex items-start gap-2 leading-snug break-words">
                {sub.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                ) : (
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <span className="font-semibold text-foreground">{scenario.title}</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm font-medium text-foreground/80 flex flex-wrap items-center gap-1.5">
                <span>Submitted by <strong>{student.fullName}</strong></span>
                <span className="text-muted-foreground font-mono">({student.lrn})</span>
                {student.groupId && <Badge variant="outline" className="text-xs">Group {student.groupId}</Badge>}
                {classroom && <Badge variant="secondary" className="text-xs">{classroom.name}</Badge>}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              <Badge variant={sub.status === 'completed' ? 'default' : 'secondary'}>
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

        <CardContent className="pt-4 pb-3">
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Submitted Plan Preview
            </h4>
            <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-md border flex items-center gap-2 overflow-hidden">
              <span className="truncate flex-1 font-mono">
                {sub.content ? sub.content.replace(/\s+/g, " ").trim() : "No content submitted yet."}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/40 py-3 text-xs text-muted-foreground flex flex-wrap justify-between items-center gap-2 border-t">
          <span>Last active: {format(new Date(sub.submittedAt), "MMMM d, yyyy h:mm a")}</span>
          {sub.score && <span className="font-bold text-foreground">Score: {sub.score}</span>}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Submissions Viewer</h2>
          <p className="text-muted-foreground mt-1">
            Review student civic action plans and inspect detailed AI evaluation results.
          </p>
        </div>
      </div>

      {/* Clean toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-lg border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, LRN, or scenario..."
            className="pl-9 text-xs h-10"
          />
        </div>

        {/* Filters & Organization */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="min-w-[200px] max-w-xs">
            <MultiSelectCombobox
              options={classroomOptions}
              selectedValues={selectedClassrooms}
              onSelectChange={setSelectedClassrooms}
              placeholder="Filter Classrooms..."
              searchPlaceholder="Search classrooms..."
              emptyText="No classrooms found."
            />
          </div>

          <div className="min-w-[200px] max-w-xs">
            <MultiSelectCombobox
              options={scenarioOptions}
              selectedValues={selectedScenarios}
              onSelectChange={setSelectedScenarios}
              placeholder="Filter Scenarios..."
              searchPlaceholder="Search scenarios..."
              emptyText="No scenarios found."
            />
          </div>

          {/* Grouping toggles */}
          <div className="flex items-center gap-1 border-l pl-2">
            <button
              onClick={() => setGroupBy("flat")}
              className={`p-2 rounded-md transition-colors ${groupBy === "flat" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setGroupBy("classroom")}
              className={`p-2 rounded-md transition-colors ${groupBy === "classroom" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
              title="Group by Classroom"
            >
              <School className="h-4 w-4" />
            </button>
            <button
              onClick={() => setGroupBy("scenario")}
              className={`p-2 rounded-md transition-colors ${groupBy === "scenario" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
              title="Group by Scenario"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {groupBy === "flat" ? (
        <div className="grid gap-6">
          {filteredSubmissions.map(item => renderCard(item))}

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
                  <Badge variant="secondary" className="text-xs">{items.length} {items.length === 1 ? 'submission' : 'submissions'}</Badge>
                </div>
              </div>

              <div className="grid gap-4">
                {items.map(item => renderCard(item))}
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
