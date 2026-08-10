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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateScenarioDialog } from "./create-scenario-dialog";
import { AssignScenarioDialog } from "./assign-scenario-dialog";
import { EditScenarioDialog } from "./edit-scenario-dialog";
import { DeleteScenarioDialog } from "./delete-scenario-dialog";
import { ScenarioDrawer } from "./scenario-drawer";
import { UnassignScenarioButton } from "./unassign-scenario-button";
import { format } from "date-fns";
import {
  BookOpen,
  School,
  FileText,
  Sparkles,
  Search,
  X,
  Plus,
  MoreVertical,
  LayoutGrid,
  Table as TableIcon,
  Layers,
  Edit,
  Trash2,
  Calendar,
  ListChecks,
  Users,
  Award,
} from "lucide-react";

interface ScenariosViewProps {
  scenarios: Scenario[];
  classrooms: Classroom[];
  assignments: ClassroomScenario[];
  submissions: Submission[];
  students: Student[];
}

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
    <div className="space-y-6 animate-fade-in">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Scenario Library
            </h2>
            <Badge variant="outline" className="font-semibold text-xs px-2.5 py-0.5">
              {stats.total} {stats.total === 1 ? "Scenario" : "Scenarios"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Author civic problem-solving scenarios, configure constraints, and assign simulations to classrooms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CreateScenarioDialog />
        </div>
      </div>


      {/* Toolbar: Search, Status Filter Pills, Sort & View Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl border bg-card/60 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scenarios, descriptions, constraints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs"
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
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl shrink-0">
          <Button
            variant={statusFilter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="h-7 text-xs px-2.5 rounded-lg shadow-2xs font-medium"
          >
            All ({stats.total})
          </Button>
          <Button
            variant={statusFilter === "assigned" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("assigned")}
            className="h-7 text-xs px-2.5 rounded-lg shadow-2xs font-medium"
          >
            Assigned ({stats.assignedScenarios})
          </Button>
          <Button
            variant={statusFilter === "unassigned" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("unassigned")}
            className="h-7 text-xs px-2.5 rounded-lg shadow-2xs font-medium"
          >
            Unassigned ({stats.unassignedScenarios})
          </Button>
        </div>

        {/* Sort & View Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="h-9 text-xs w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="most-classrooms">Most Classrooms</SelectItem>
              <SelectItem value="most-constraints">Most Constraints</SelectItem>
            </SelectContent>
          </Select>

          {/* Grid / Table Toggle */}
          <div className="flex items-center border rounded-lg p-0.5 bg-muted/40 shrink-0">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("grid")}
              className="h-7 w-7"
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("table")}
              className="h-7 w-7"
              title="Table View"
            >
              <TableIcon className="h-3.5 w-3.5" />
            </Button>
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
            <h3 className="text-base font-bold text-foreground">No Scenarios Found</h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "No scenarios match your search filters. Try adjusting your query."
                : "Your scenario library is empty. Create your first civic scenario to get started."}
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
                <span>Create Scenario</span>
              </Button>
            </Link>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid gap-4 md:grid-cols-2">
          {filteredScenarios.map((scenario) => {
            const assigned = scenarioClassroomsMap[scenario.id] || [];
            const assignedClassroomIds = assigned.map((c) => c.id);
            const scenarioSubmissionsCount = submissions.filter((s) => s.scenarioId === scenario.id).length;

            return (
              <Card
                key={scenario.id}
                className="overflow-hidden shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <CardHeader className="pb-3 border-b bg-muted/20">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {scenario.missionData ? (
                            <Badge variant="outline" className="text-[10px] font-semibold">
                              <Sparkles className="h-3 w-3 mr-1 text-primary" /> Civic Mission
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] font-semibold">
                              Standard Scenario
                            </Badge>
                          )}
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(scenario.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>

                        <CardTitle className="text-lg font-bold tracking-tight pt-1 truncate">
                          {scenario.title}
                        </CardTitle>
                      </div>

                      {/* Dropdown Action Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
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
                              <span>Edit Scenario</span>
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
                                <span>Delete Scenario</span>
                              </DropdownMenuItem>
                            }
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <CardDescription className="line-clamp-2 text-xs mt-1 leading-relaxed">
                      {scenario.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>

                  {/* Card Content: Constraints Preview */}
                  <CardContent className="pt-4 space-y-4">
                    {/* Constraints Pills */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-muted-foreground flex items-center gap-1">
                          <ListChecks className="h-3.5 w-3.5 text-primary" />
                          Constraints ({scenario.constraints?.length || 0})
                        </span>
                      </div>
                      {scenario.constraints && scenario.constraints.length > 0 ? (
                        <div className="space-y-1">
                          {scenario.constraints.slice(0, 2).map((c, i) => (
                            <div
                              key={i}
                              className="text-[11px] text-muted-foreground line-clamp-1 bg-muted/40 p-1.5 px-2 rounded-md border"
                            >
                              • {c}
                            </div>
                          ))}
                          {scenario.constraints.length > 2 && (
                            <p className="text-[10px] text-muted-foreground italic pl-1">
                              +{scenario.constraints.length - 2} more constraint{scenario.constraints.length - 2 !== 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic">No constraints configured.</p>
                      )}
                    </div>

                    {/* Assigned Classrooms */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-muted-foreground flex items-center gap-1">
                          <School className="h-3.5 w-3.5 text-primary" />
                          Assigned Classrooms ({assigned.length})
                        </span>
                        <AssignScenarioDialog
                          scenarioId={scenario.id}
                          scenarioTitle={scenario.title}
                          classrooms={classrooms}
                          assignedClassroomIds={assignedClassroomIds}
                        />
                      </div>

                      {assigned.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {assigned.map((c) => (
                            <span
                              key={c.id}
                              className="inline-flex items-center gap-1 text-[11px] font-medium bg-muted/60 text-foreground border rounded-md px-2 py-0.5"
                            >
                              <span>{c.name}</span>
                              <UnassignScenarioButton
                                scenarioId={scenario.id}
                                classroomId={c.id}
                                classroomName={c.name}
                              />
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic">
                          Not assigned to any classrooms yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </div>

                {/* Card Footer */}
                <CardFooter className="pt-3 border-t bg-muted/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-medium text-foreground">{scenarioSubmissionsCount}</span>
                    <span>submission{scenarioSubmissionsCount !== 1 ? "s" : ""}</span>
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
                  <th className="py-3 px-4">Scenario Title</th>
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
