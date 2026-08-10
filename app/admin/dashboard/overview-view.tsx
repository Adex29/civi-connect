"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Classroom, Scenario, Student, Submission, Group, ClassroomScenario } from "@/lib/definitions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateClassroomDialog } from "./classrooms/create-classroom-dialog";
import { SubmissionDrawer } from "./submissions/submission-drawer";
import { format } from "date-fns";
import {
  Users,
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
  Copy,
  Check,
  School,
  GraduationCap,
  ChevronRight,
  Activity,
  Award,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

interface OverviewViewProps {
  classrooms: Classroom[];
  students: Student[];
  scenarios: Scenario[];
  submissions: Submission[];
  groups: Group[];
  classroomScenarios: ClassroomScenario[];
}

export function OverviewView({
  classrooms,
  students,
  scenarios,
  submissions,
  groups,
  classroomScenarios,
}: OverviewViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Join code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Pre-calculate scenario assignments map
  const scenariosMap = useMemo(() => {
    const map: Record<string, Scenario[]> = {};
    for (const c of classrooms) {
      const assignedScenarioIds = classroomScenarios
        .filter((a) => a.classroomId === c.id && a.isActive)
        .map((a) => a.scenarioId);
      map[c.id] = scenarios.filter((s) => assignedScenarioIds.includes(s.id));
    }
    return map;
  }, [classrooms, classroomScenarios, scenarios]);

  // High-level statistics
  const stats = useMemo(() => {
    const totalClassrooms = classrooms.length;
    const activeClassrooms = classrooms.filter((c) => c.status === "active").length;
    const totalStudents = students.length;
    const totalScenarios = scenarios.length;
    const totalSubmissions = submissions.length;
    const completedSubmissions = submissions.filter((s) => s.status === "completed").length;
    const inProgressSubmissions = totalSubmissions - completedSubmissions;

    const scoredSubmissions = submissions.filter((s) => typeof s.score === "number" && s.score !== null);
    const avgScore =
      scoredSubmissions.length > 0
        ? Math.round(scoredSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0) / scoredSubmissions.length)
        : null;

    const completionRate = totalSubmissions > 0 ? Math.round((completedSubmissions / totalSubmissions) * 100) : 0;

    return {
      totalClassrooms,
      activeClassrooms,
      totalStudents,
      totalScenarios,
      totalSubmissions,
      completedSubmissions,
      inProgressSubmissions,
      avgScore,
      completionRate,
      totalGroups: groups.length,
    };
  }, [classrooms, students, scenarios, submissions, groups]);

  // Recent Submissions with enriched student, scenario, and classroom references
  const enrichedRecentSubmissions = useMemo(() => {
    return submissions
      .slice()
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 6)
      .map((sub) => {
        const student = students.find((s) => s.id === sub.studentId);
        const scenario = scenarios.find((s) => s.id === sub.scenarioId);
        const classroom = classrooms.find((c) => c.id === student?.classroomId);
        return { sub, student, scenario, classroom };
      })
      .filter((item) => !!item.student && !!item.scenario);
  }, [submissions, students, scenarios, classrooms]);

  // Active classrooms preview
  const activeClassroomsList = useMemo(() => {
    return classrooms
      .filter((c) => c.status === "active")
      .slice(0, 4);
  }, [classrooms]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Overview</h2>
          <p className="text-muted-foreground mt-1">
            Welcome to the Civi-Tech Admin Dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CreateClassroomDialog />
          <Link href="/admin/dashboard/scenarios/new">
            <Button variant="outline" className="gap-1.5 shadow-2xs font-medium text-xs">
              <Plus className="h-4 w-4" />
              <span>New Scenario</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Classrooms */}
        <Card className="p-4 shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Classrooms
            </span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <School className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tracking-tight text-foreground">{stats.totalClassrooms}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1 font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {stats.activeClassrooms} Active
              </span>
              <span>•</span>
              <span>{stats.totalGroups} Teams</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Registered Students */}
        <Card className="p-4 shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Students
            </span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tracking-tight text-foreground">{stats.totalStudents}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Registered across all classrooms
            </div>
          </div>
        </Card>

        {/* Card 3: Scenario Library */}
        <Card className="p-4 shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Scenarios
            </span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tracking-tight text-foreground">{stats.totalScenarios}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Available in the library
            </div>
          </div>
        </Card>

        {/* Card 4: Submissions */}
        <Card className="p-4 shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Submissions
            </span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tracking-tight text-foreground">{stats.totalSubmissions}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="font-semibold text-primary">{stats.completionRate}% Completed</span>
              {stats.avgScore !== null && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-foreground">Avg: {stats.avgScore} pts</span>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Action Hub */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tile 1: Classrooms */}
        <Link
          href="/admin/dashboard/classrooms"
          className="p-4 rounded-xl border bg-card hover:bg-muted/40 hover:border-primary/40 transition-all shadow-2xs group flex items-start justify-between"
        >
          <div className="space-y-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
              <School className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-sm text-foreground pt-1 group-hover:text-primary transition-colors">Classrooms</h4>
            <p className="text-xs text-muted-foreground">
              Generate join codes and view rosters.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-transform mt-1" />
        </Link>

        {/* Tile 2: Scenarios */}
        <Link
          href="/admin/dashboard/scenarios"
          className="p-4 rounded-xl border bg-card hover:bg-muted/40 hover:border-primary/40 transition-all shadow-2xs group flex items-start justify-between"
        >
          <div className="space-y-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
              <BookOpen className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-sm text-foreground pt-1 group-hover:text-primary transition-colors">Scenario Library</h4>
            <p className="text-xs text-muted-foreground">
              Create civic scenarios and constraints.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-transform mt-1" />
        </Link>

        {/* Tile 3: Submissions */}
        <Link
          href="/admin/dashboard/submissions"
          className="p-4 rounded-xl border bg-card hover:bg-muted/40 hover:border-primary/40 transition-all shadow-2xs group flex items-start justify-between"
        >
          <div className="space-y-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
              <FileText className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-sm text-foreground pt-1 group-hover:text-primary transition-colors">Submissions</h4>
            <p className="text-xs text-muted-foreground">
              Review student action plans & evaluations.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-transform mt-1" />
        </Link>

        {/* Tile 4: Students Directory */}
        <Link
          href="/admin/dashboard/students"
          className="p-4 rounded-xl border bg-card hover:bg-muted/40 hover:border-primary/40 transition-all shadow-2xs group flex items-start justify-between"
        >
          <div className="space-y-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
              <Users className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-sm text-foreground pt-1 group-hover:text-primary transition-colors">Students Directory</h4>
            <p className="text-xs text-muted-foreground">
              Browse student enrollments and groups.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-transform mt-1" />
        </Link>
      </div>

      {/* Two Column Layout: Recent Submissions + Active Classrooms */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): Live Recent Submissions Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span>Recent Submissions</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Latest student civic action plans submitted across all classrooms.
              </p>
            </div>

            <Link href="/admin/dashboard/submissions">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary font-semibold hover:text-primary hover:bg-primary/10">
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {enrichedRecentSubmissions.length === 0 ? (
            <div className="p-12 text-center border rounded-2xl border-dashed bg-muted/20 space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1 max-w-xs mx-auto">
                <p className="text-sm font-semibold text-foreground">No Submissions Yet</p>
                <p className="text-xs text-muted-foreground">
                  Student submissions will appear here once submitted.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {enrichedRecentSubmissions.map(({ sub, student, scenario, classroom }) => {
                if (!student || !scenario) return null;
                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border bg-card hover:border-primary/40 hover:bg-muted/20 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={sub.status === "completed" ? "default" : "secondary"}
                          className="text-[10px] font-semibold"
                        >
                          {sub.status === "completed" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-primary-foreground" />
                              COMPLETED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              IN PROGRESS
                            </span>
                          )}
                        </Badge>
                        {typeof sub.score === "number" && (
                          <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/30 bg-primary/5">
                            <Award className="h-3 w-3 mr-1 text-primary" /> Score: {sub.score} pts
                          </Badge>
                        )}
                        <span className="text-[11px] text-muted-foreground">
                          {format(new Date(sub.submittedAt), "MMM d, h:mm a")}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-foreground truncate pt-0.5">
                        {scenario.title}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        <span>Submitted by <strong className="text-foreground">{student.fullName}</strong></span>
                        <span className="font-mono text-[11px]">({student.lrn})</span>
                        {classroom && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                              {classroom.name}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <SubmissionDrawer
                        submission={sub}
                        student={student}
                        scenario={scenario}
                        classroom={classroom}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Active Classrooms Spotlight */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
              <School className="h-4 w-4 text-primary" />
              <span>Active Classrooms</span>
            </h3>
            <Link href="/admin/dashboard/classrooms" className="text-xs text-primary font-semibold hover:underline">
              View All
            </Link>
          </div>

          {activeClassroomsList.length === 0 ? (
            <div className="p-6 text-center border rounded-xl border-dashed bg-muted/20 text-xs text-muted-foreground">
              No active classrooms yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeClassroomsList.map((classroom) => {
                const studentCount = students.filter((s) => s.classroomId === classroom.id).length;
                const assignedScenarios = scenariosMap[classroom.id] || [];
                const isCopied = copiedId === classroom.id;

                return (
                  <div
                    key={classroom.id}
                    className="p-3.5 rounded-xl border bg-card hover:border-primary/40 hover:bg-muted/20 transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-xs text-foreground truncate">{classroom.name}</h5>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span>{studentCount} student{studentCount !== 1 ? "s" : ""}</span>
                          <span>•</span>
                          <span>{assignedScenarios.length} scenario{assignedScenarios.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>

                      {/* Join Code Widget */}
                      <div className="flex items-center gap-1 bg-muted/50 border rounded-md px-2 py-0.5 shrink-0">
                        <span className="font-mono text-xs font-bold text-primary">
                          {classroom.code}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => copyCode(classroom.code, classroom.id)}
                          className="h-6 w-6"
                          title="Copy Code"
                        >
                          {isCopied ? (
                            <Check className="h-3 w-3 text-primary font-bold" />
                          ) : (
                            <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
