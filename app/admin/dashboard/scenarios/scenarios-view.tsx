"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Scenario, Classroom, ClassroomScenario, Submission, Student } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { CreateScenarioDialog } from "./create-scenario-dialog";
import { AssignScenarioDialog } from "./assign-scenario-dialog";
import { DeleteScenarioDialog } from "./delete-scenario-dialog";
import { ScenarioDrawer } from "./scenario-drawer";
import { UnassignScenarioButton } from "./unassign-scenario-button";
import { format } from "date-fns";
import {
  BookOpen,
  School,
  Sparkles,
  Search,
  X,
  Plus,
  MoreVertical,
  LayoutGrid,
  Table as TableIcon,
  Edit,
  Trash2,
  Calendar,
  ListChecks,
} from "lucide-react";

interface ScenariosViewProps {
  scenarios: Scenario[];
  classrooms: Classroom[];
  assignments: ClassroomScenario[];
  submissions: Submission[];
  students: Student[];
}

const sortOptions: ComboboxOption[] = [
  { value: "newest", label: "Newest First" },
  { value: "title", label: "Title (A-Z)" },
  { value: "most-classrooms", label: "Most Classrooms" },
  { value: "most-constraints", label: "Most Constraints" },
];

export function ScenariosView({
  scenarios,
  classrooms,
  assignments,
  submissions,
  students,
}: ScenariosViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "assigned" | "unassigned">("all");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "most-classrooms" | "most-constraints">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Helper map for assigned classrooms for each scenario
  const scenarioClassroomsMap = useMemo(() => {
    const map: Record<string, Classroom[]> = {};
    for (const sc of scenarios) {
      const assigned = assignments
        .filter((a) => a.scenarioId === sc.id && a.isActive)
        .map((a) => classrooms.find((c) => c.id === a.classroomId))
        .filter((c): c is Classroom => Boolean(c));
      map[sc.id] = assigned;
    }
    return map;
  }, [scenarios, assignments, classrooms]);

  // Overall statistics
  const stats = useMemo(() => {
    const total = scenarios.length;
    const customMissions = scenarios.filter((s) => !!s.missionData).length;
    const assignedScenarios = scenarios.filter((s) => (scenarioClassroomsMap[s.id] || []).length > 0).length;
    const unassignedScenarios = total - assignedScenarios;
    const totalConstraints = scenarios.reduce((acc, curr) => acc + (curr.constraints?.length || 0), 0);
    const totalSubmissions = submissions.length;

    // Classroom coverage
    const assignedClassroomIds = new Set(
      assignments.filter((a) => a.isActive).map((a) => a.classroomId)
    );
    const classroomCoverage =
      classrooms.length > 0 ? Math.round((assignedClassroomIds.size / classrooms.length) * 100) : 0;

    return {
      total,
      customMissions,
      assignedScenarios,
      unassignedScenarios,
      totalConstraints,
      totalSubmissions,
      classroomCoverage,
      assignedClassroomsCount: assignedClassroomIds.size,
    };
  }, [scenarios, scenarioClassroomsMap, submissions, assignments, classrooms]);

  // Filtered and sorted scenarios
  const filteredScenarios = useMemo(() => {
    return scenarios
      .filter((sc) => {
        const assigned = scenarioClassroomsMap[sc.id] || [];
        const isAssigned = assigned.length > 0;

        // Status Filter
        if (statusFilter === "assigned" && !isAssigned) return false;
        if (statusFilter === "unassigned" && isAssigned) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = sc.title.toLowerCase().includes(q);
          const matchDesc = sc.description?.toLowerCase().includes(q);
          const matchConstraints = sc.constraints?.some((c) => c.toLowerCase().includes(q));
          const matchClassrooms = assigned.some((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
          return matchTitle || matchDesc || matchConstraints || matchClassrooms;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "most-classrooms") {
          const countA = (scenarioClassroomsMap[a.id] || []).length;
          const countB = (scenarioClassroomsMap[b.id] || []).length;
          return countB - countA;
        }
        if (sortBy === "most-constraints") {
          return (b.constraints?.length || 0) - (a.constraints?.length || 0);
        }
        return 0;
      });
  }, [scenarios, scenarioClassroomsMap, statusFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Header & Primary Action */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-primary/10 pb-5 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="page-title text-4xl">
              Mission Library
            </h2>
            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-bold">
              {stats.total} {stats.total === 1 ? "Mission" : "Missions"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Author civic problem-solving missions, configure constraints, and assign simulations to classrooms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CreateScenarioDialog />
        </div>
      </div>


      {/* Toolbar: Search, Status Filter Pills, Sort & View Toggle */}
      <div className="toolbar-panel flex flex-col items-stretch justify-between gap-3 rounded-xl p-2.5 lg:flex-row lg:items-center">
        {/* Search Input */}
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search missions, descriptions, constraints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-9 pr-8 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="toolbar-control-group grid grid-cols-3 gap-1 rounded-lg p-1 sm:flex sm:shrink-0 sm:items-center">
          <button
            data-selected={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            className="toolbar-toggle h-8 w-full rounded-md px-2 text-[11px] sm:w-auto sm:px-3 sm:text-xs"
          >
            All ({stats.total})
          </button>
          <button
            data-selected={statusFilter === "assigned"}
            onClick={() => setStatusFilter("assigned")}
            className="toolbar-toggle h-8 w-full rounded-md px-2 text-[11px] sm:w-auto sm:px-3 sm:text-xs"
          >
            Assigned ({stats.assignedScenarios})
          </button>
          <button
            data-selected={statusFilter === "unassigned"}
            onClick={() => setStatusFilter("unassigned")}
            className="toolbar-toggle h-8 w-full rounded-md px-2 text-[11px] sm:w-auto sm:px-3 sm:text-xs"
          >
            Unassigned ({stats.unassignedScenarios})
          </button>
        </div>

        {/* Sort & View Switcher */}
        <div className="flex min-w-0 items-center gap-2 sm:shrink-0">
          <Combobox
            options={sortOptions}
            value={sortBy}
            onValueChange={(v) => setSortBy(v as typeof sortBy)}
            placeholder="Sort by"
            searchPlaceholder="Search sort options..."
            className="h-9 min-w-0 flex-1 text-xs sm:w-[165px] sm:flex-none"
          />

          {/* Grid / Table Toggle */}
          <div className="toolbar-control-group flex shrink-0 items-center rounded-lg p-0.5">
            <button
              data-selected={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              className="toolbar-toggle flex h-7 w-7 items-center justify-center rounded-md"
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              data-selected={viewMode === "table"}
              onClick={() => setViewMode("table")}
              className="toolbar-toggle flex h-7 w-7 items-center justify-center rounded-md"
              title="Table View"
            >
              <TableIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Grid vs Table */}
      {filteredScenarios.length === 0 ? (
        <div className="py-16 text-center border rounded-2xl border-dashed bg-muted/20 space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-foreground">No Missions Found</h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "No missions match your search filters. Try adjusting your query."
                : "Your mission library is empty. Create your first civic mission to get started."}
            </p>
          </div>
          {searchQuery || statusFilter !== "all" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-xs"
            >
              Reset Filters
            </Button>
          ) : (
            <Link href="/admin/dashboard/scenarios/new">
              <Button size="sm" className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" />
                <span>Create Mission</span>
              </Button>
            </Link>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid gap-5 xl:grid-cols-2">
          {filteredScenarios.map((scenario) => {
            const assigned = scenarioClassroomsMap[scenario.id] || [];
            const assignedClassroomIds = assigned.map((c) => c.id);
            const scenarioSubmissionsCount = submissions.filter((s) => s.scenarioId === scenario.id).length;

            return (
              <Card
                key={scenario.id}
                className="group flex min-h-[440px] flex-col gap-0 overflow-hidden p-0"
              >
                <div className="flex flex-1 flex-col">
                  {/* Card Header */}
                  <CardHeader className="border-b border-primary/20 p-5 pb-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {scenario.missionData ? (
                            <Badge variant="secondary" className="border-0 bg-secondary/20 text-[10px] text-primary">
                              <Sparkles className="mr-1 h-3 w-3" /> Civic Mission
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="border-0 text-[10px]">
                              Standard Mission
                            </Badge>
                          )}
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(scenario.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>

                      </div>

                      {/* Dropdown Action Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-48 text-xs">
                          <ScenarioDrawer
                            scenario={scenario}
                            classrooms={classrooms}
                            assignments={assignments}
                            submissions={submissions}
                            students={students}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer gap-2">
                                <BookOpen className="h-3.5 w-3.5 text-primary" />
                                <span>Inspect & Submissions</span>
                              </DropdownMenuItem>
                            }
                          />

                          <AssignScenarioDialog
                            scenarioId={scenario.id}
                            scenarioTitle={scenario.title}
                            classrooms={classrooms}
                            assignedClassroomIds={assignedClassroomIds}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer gap-2">
                                <School className="h-3.5 w-3.5 text-primary" />
                                <span>Assign to Class</span>
                              </DropdownMenuItem>
                            }
                          />

                          <Link href={`/admin/dashboard/scenarios/${scenario.id}/edit`}>
                            <DropdownMenuItem className="cursor-pointer gap-2">
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit Mission</span>
                            </DropdownMenuItem>
                          </Link>

                          <DropdownMenuSeparator />

                          <DeleteScenarioDialog
                            scenarioId={scenario.id}
                            scenarioTitle={scenario.title}
                            trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete Mission</span>
                              </DropdownMenuItem>
                            }
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <CardTitle className="mt-4 line-clamp-2 text-xl font-black leading-tight tracking-tight text-primary">
                      {scenario.title}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2 text-sm leading-6">
                      {scenario.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col gap-6 px-5 py-5">
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                        <ListChecks className="h-4 w-4 text-primary" />
                        <span>Constraints ({scenario.constraints?.length || 0})</span>
                      </div>

                      {scenario.constraints && scenario.constraints.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {scenario.constraints.slice(0, 2).map((constraint, index) => (
                            <div key={index} className="flex h-9 min-w-0 items-center border border-primary/25 bg-muted/25 px-3 text-xs text-muted-foreground">
                              <span className="mr-1 shrink-0" aria-hidden="true">•</span>
                              <span className="min-w-0 truncate">{constraint}</span>
                            </div>
                          ))}
                          {scenario.constraints.length > 2 && (
                            <p className="px-1 text-[11px] italic leading-4 text-muted-foreground">
                              +{scenario.constraints.length - 2} more constraint{scenario.constraints.length - 2 === 1 ? "" : "s"}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 text-xs italic text-muted-foreground">No constraints configured.</p>
                      )}
                    </div>

                    <div className="mt-auto">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                          <School className="h-4 w-4 text-primary" />
                          <span>Assigned Classrooms ({assigned.length})</span>
                        </div>
                        <AssignScenarioDialog
                          scenarioId={scenario.id}
                          scenarioTitle={scenario.title}
                          classrooms={classrooms}
                          assignedClassroomIds={assignedClassroomIds}
                        />
                      </div>

                      {assigned.length > 0 ? (
                        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
                          {assigned.map((classroom) => (
                            <span key={classroom.id} className="info-chip inline-flex max-w-full items-center px-2.5 py-1 text-xs">
                              <span className="truncate">{classroom.name}</span>
                              <UnassignScenarioButton
                                scenarioId={scenario.id}
                                classroomId={classroom.id}
                                classroomName={classroom.name}
                              />
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-xs italic text-muted-foreground">Not assigned to any classrooms yet.</p>
                      )}
                    </div>
                  </CardContent>
                </div>

                {/* Card Footer */}
                <CardFooter className="flex items-center justify-between gap-3 border-t border-primary/20 bg-transparent px-5 py-4 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-bold text-foreground">{scenarioSubmissionsCount}</span>
                    <span>submission{scenarioSubmissionsCount === 1 ? "" : "s"}</span>
                  </div>
                  <ScenarioDrawer
                    scenario={scenario}
                    classrooms={classrooms}
                    assignments={assignments}
                    submissions={submissions}
                    students={students}
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        /* DATA TABLE VIEW */
        <Card className="overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase bg-muted/60 text-muted-foreground border-b font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Mission Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Constraints</th>
                  <th className="py-3 px-4">Assigned Classrooms</th>
                  <th className="py-3 px-4">Submissions</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredScenarios.map((scenario) => {
                  const assigned = scenarioClassroomsMap[scenario.id] || [];
                  const assignedClassroomIds = assigned.map((c) => c.id);
                  const subCount = submissions.filter((s) => s.scenarioId === scenario.id).length;

                  return (
                    <tr key={scenario.id} className="hover:bg-muted/30 transition-colors">
                      {/* Title & Description */}
                      <td className="py-3 px-4 font-semibold text-foreground max-w-[260px]">
                        <div className="truncate text-sm">{scenario.title}</div>
                        <div className="text-[11px] font-normal text-muted-foreground line-clamp-1">
                          {scenario.description || "No description."}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {scenario.missionData ? (
                          <Badge variant="outline" className="text-[10px]">
                            <Sparkles className="h-3 w-3 mr-1 text-primary" /> Civic Mission
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Standard
                          </Badge>
                        )}
                      </td>

                      {/* Constraints Count */}
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-foreground">
                        {scenario.constraints?.length || 0} rules
                      </td>

                      {/* Assigned Classrooms */}
                      <td className="py-3 px-4 max-w-[220px]">
                        {assigned.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {assigned.slice(0, 2).map((c) => (
                              <Badge key={c.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {c.name}
                              </Badge>
                            ))}
                            {assigned.length > 2 && (
                              <span className="text-[10px] text-muted-foreground self-center">
                                +{assigned.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-[11px]">Unassigned</span>
                        )}
                      </td>

                      {/* Submissions */}
                      <td className="py-3 px-4 whitespace-nowrap font-semibold text-foreground">
                        {subCount}
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                        {format(new Date(scenario.createdAt), "MMM d, yyyy")}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <ScenarioDrawer
                            scenario={scenario}
                            classrooms={classrooms}
                            assignments={assignments}
                            submissions={submissions}
                            students={students}
                          />

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              }
                            />
                            <DropdownMenuContent align="end" className="w-44 text-xs">
                              <AssignScenarioDialog
                                scenarioId={scenario.id}
                                scenarioTitle={scenario.title}
                                classrooms={classrooms}
                                assignedClassroomIds={assignedClassroomIds}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer gap-2">
                                    <School className="h-3.5 w-3.5 text-primary" />
                                    <span>Assign to Class</span>
                                  </DropdownMenuItem>
                                }
                              />
                              <Link href={`/admin/dashboard/scenarios/${scenario.id}/edit`}>
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                  <Edit className="h-3.5 w-3.5" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuSeparator />
                              <DeleteScenarioDialog
                                scenarioId={scenario.id}
                                scenarioTitle={scenario.title}
                                trigger={
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                }
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
