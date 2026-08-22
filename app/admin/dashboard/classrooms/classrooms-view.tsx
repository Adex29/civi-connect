"use client";

import { useState, useMemo } from "react";
import { Classroom, Student, Scenario, Group, Submission } from "@/lib/definitions";
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
import { CreateClassroomDialog } from "./create-classroom-dialog";
import { EditClassroomDialog } from "./edit-classroom-dialog";
import { DeleteClassroomDialog } from "./delete-classroom-dialog";
import { ClassroomRosterDrawer } from "./classroom-roster-drawer";
import { format } from "date-fns";
import {
  Users,
  BookOpen,
  Copy,
  Check,
  School,
  Calendar,
  Plus,
  Search,
  LayoutGrid,
  List,
  Layers,
  ArrowUpDown,
  MoreVertical,
  SlidersHorizontal,
  Archive,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  RotateCcw,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { toggleClassroomStatusAction } from "./actions";

interface ClassroomsViewProps {
  classrooms: Classroom[];
  students: Student[];
  allScenarios?: Scenario[];
  scenariosMap: Record<string, Scenario[]>;
  groups?: Group[];
  submissions?: Submission[];
}

export function ClassroomsView({
  classrooms,
  students,
  allScenarios = [],
  scenariosMap,
  groups = [],
  submissions = [],
}: ClassroomsViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">("all");
  const [sortBy, setSortBy] = useState<"newest" | "name" | "students" | "scenarios">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const getStudentCount = (classroomId: string) => {
    return students.filter((s) => s.classroomId === classroomId).length;
  };

  const getGroupCount = (classroomId: string) => {
    return groups.filter((g) => g.classroomId === classroomId).length;
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Join code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (classroomId: string, currentStatus: "active" | "archived") => {
    const newStatus = currentStatus === "active" ? "archived" : "active";
    try {
      const res = await toggleClassroomStatusAction(classroomId, newStatus);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Classroom marked as ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  // High-level statistics
  const stats = useMemo(() => {
    const total = classrooms.length;
    const active = classrooms.filter((c) => c.status === "active").length;
    const archived = total - active;
    const totalStudents = students.length;
    const avgStudents = total > 0 ? (totalStudents / total).toFixed(1) : "0";
    const totalGroups = groups.length;
    
    // Coverage: classrooms with at least one scenario
    const withScenarios = classrooms.filter((c) => (scenariosMap[c.id] || []).length > 0).length;
    const scenarioCoverage = total > 0 ? Math.round((withScenarios / total) * 100) : 0;

    return {
      total,
      active,
      archived,
      totalStudents,
      avgStudents,
      totalGroups,
      withScenarios,
      scenarioCoverage,
    };
  }, [classrooms, students, groups, scenariosMap]);

  // Filtered and sorted classrooms
  const filteredClassrooms = useMemo(() => {
    return classrooms
      .filter((classroom) => {
        // Status filter
        if (statusFilter !== "all" && classroom.status !== statusFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = classroom.name.toLowerCase().includes(query);
          const matchesCode = classroom.code.toLowerCase().includes(query);
          const matchesDesc = classroom.description?.toLowerCase().includes(query) || false;
          if (!matchesName && !matchesCode && !matchesDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "students") {
          return getStudentCount(b.id) - getStudentCount(a.id);
        }
        if (sortBy === "scenarios") {
          const scA = (scenariosMap[a.id] || []).length;
          const scB = (scenariosMap[b.id] || []).length;
          return scB - scA;
        }
        // "newest" by default
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [classrooms, searchQuery, statusFilter, sortBy, students, scenariosMap]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight">Classrooms</h1>
            <Badge variant="outline" className="font-semibold text-xs px-2.5 py-0.5">
              {stats.total} {stats.total === 1 ? "Section" : "Sections"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your class sections, distribute 6-character join codes, and track student enrollment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CreateClassroomDialog />
        </div>
      </div>


      {/* Toolbar: Search, Status Filter, Sort, View Toggle */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-3.5 rounded-xl border bg-card/60 shadow-2xs">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classrooms by name or join code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Tabs & Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Status Tabs */}
          <div className="flex items-center p-0.5 rounded-lg bg-muted border text-xs font-medium">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === "all"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === "active"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setStatusFilter("archived")}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === "archived"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Archived ({stats.archived})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-lg border bg-background px-3 text-xs text-foreground font-medium focus:outline-ring cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="name">Name (A - Z)</option>
              <option value="students">Most Students</option>
              <option value="scenarios">Most Missions</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-muted border">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setViewMode("grid")}
              className={`h-7 w-7 rounded-md ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setViewMode("table")}
              className={`h-7 w-7 rounded-md ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table List View"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Grid View or Table View */}
      {filteredClassrooms.length === 0 ? (
        /* Empty / Filtered-out State */
        <div className="py-16 text-center border rounded-2xl border-dashed bg-muted/20 space-y-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground shadow-inner">
            <School className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-lg font-bold">
              {classrooms.length === 0 ? "No Classrooms Created Yet" : "No Classrooms Found"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {classrooms.length === 0
                ? "Create your first classroom to generate unique student join codes and assign civic simulations."
                : `No classrooms matched your current filters "${searchQuery || statusFilter}". Try resetting your search.`}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-2">
            {classrooms.length === 0 ? (
              <CreateClassroomDialog />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID CARDS VIEW */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClassrooms.map((classroom) => {
            const assignedScenarios = scenariosMap[classroom.id] || [];
            const studentCount = getStudentCount(classroom.id);
            const groupCount = getGroupCount(classroom.id);
            const isCopied = copiedId === classroom.id;

            return (
              <Card
                key={classroom.id}
                className={`group flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/50 bg-card ${
                  classroom.status === "archived" ? "opacity-80 border-dashed" : ""
                }`}
              >
                <div>
                  {/* Card Header */}
                  <CardHeader className="pb-3 border-b bg-muted/20">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={classroom.status === "active" ? "default" : "secondary"}
                            className="text-[10px] font-semibold tracking-wider"
                          >
                            {classroom.status === "active" ? (
                              <span className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                                ACTIVE
                              </span>
                            ) : (
                              "ARCHIVED"
                            )}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(classroom.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <CardTitle className="text-xl font-bold tracking-tight pt-1 truncate">
                          {classroom.name}
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
                          <ClassroomRosterDrawer
                            classroom={classroom}
                            students={students}
                            scenarios={assignedScenarios}
                            allScenarios={allScenarios}
                            groups={groups}
                            submissions={submissions}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer gap-2">
                                <Users className="h-3.5 w-3.5 text-primary" />
                                <span>View Roster & Missions</span>
                              </DropdownMenuItem>
                            }
                          />
                          <DropdownMenuItem onClick={() => copyCode(classroom.code, classroom.id)} className="cursor-pointer gap-2">
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Join Code</span>
                          </DropdownMenuItem>
                          <EditClassroomDialog
                            classroom={classroom}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer gap-2">
                                <EditClassroomDialog classroom={classroom} />
                                <span>Edit Classroom</span>
                              </DropdownMenuItem>
                            }
                          />
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(classroom.id, classroom.status)}
                            className="cursor-pointer gap-2"
                          >
                            <Archive className="h-3.5 w-3.5" />
                            <span>{classroom.status === "active" ? "Archive Classroom" : "Reactivate"}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DeleteClassroomDialog
                            classroomId={classroom.id}
                            classroomName={classroom.name}
                            studentCount={studentCount}
                            trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                              >
                                <DeleteClassroomDialog classroomId={classroom.id} classroomName={classroom.name} />
                                <span>Delete Classroom</span>
                              </DropdownMenuItem>
                            }
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <CardDescription className="line-clamp-2 text-xs mt-1 leading-relaxed">
                      {classroom.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>

                  {/* Card Content */}
                  <CardContent className="pt-4 space-y-4">
                    {/* Join Code Widget */}
                    <div className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-muted/40 border transition-colors group-hover:border-primary/30">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                          Join Code
                        </p>
                        <p className="font-mono text-base font-black text-foreground tracking-widest">
                          {classroom.code}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyCode(classroom.code, classroom.id)}
                        className="h-8 gap-1.5 text-xs font-semibold shadow-2xs"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-foreground" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Class Stats Pills */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg border bg-card flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                          <GraduationCap className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-muted-foreground text-[10px] uppercase font-semibold">Students</p>
                          <p className="font-bold text-foreground text-xs truncate">
                            {studentCount} Enrolled
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg border bg-card flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-muted-foreground text-[10px] uppercase font-semibold">Missions</p>
                          <p className="font-bold text-foreground text-xs truncate">
                            {assignedScenarios.length} Assigned
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Scenarios Preview Pill Tags */}
                    {assignedScenarios.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-primary" /> Active Civic Missions:
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {assignedScenarios.slice(0, 2).map((sc) => (
                            <Badge
                              key={sc.id}
                              variant="outline"
                              className="text-[10px] font-medium bg-muted/30 truncate max-w-[200px]"
                            >
                              {sc.title}
                            </Badge>
                          ))}
                          {assignedScenarios.length > 2 && (
                            <Badge variant="secondary" className="text-[10px]">
                              +{assignedScenarios.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-muted-foreground italic py-1">
                        No missions assigned yet.
                      </div>
                    )}
                  </CardContent>
                </div>

                {/* Card Footer */}
                <CardFooter className="pt-2 pb-4 border-t bg-muted/10">
                  <ClassroomRosterDrawer
                    classroom={classroom}
                    students={students}
                    scenarios={assignedScenarios}
                    allScenarios={allScenarios}
                    groups={groups}
                    submissions={submissions}
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="border rounded-2xl overflow-hidden bg-card shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Classroom Name</th>
                  <th className="py-3 px-4">Join Code</th>
                  <th className="py-3 px-4">Enrolled Students</th>
                  <th className="py-3 px-4">Missions</th>
                  <th className="py-3 px-4">Teams</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredClassrooms.map((classroom) => {
                  const assignedScenarios = scenariosMap[classroom.id] || [];
                  const studentCount = getStudentCount(classroom.id);
                  const groupCount = getGroupCount(classroom.id);
                  const isCopied = copiedId === classroom.id;

                  return (
                    <tr
                      key={classroom.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge
                          variant={classroom.status === "active" ? "default" : "secondary"}
                          className="text-[10px] font-semibold"
                        >
                          {classroom.status.toUpperCase()}
                        </Badge>
                      </td>

                      {/* Name & Description */}
                      <td className="py-3.5 px-4 min-w-[180px]">
                        <div className="font-bold text-foreground text-sm">{classroom.name}</div>
                        {classroom.description && (
                          <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {classroom.description}
                          </div>
                        )}
                      </td>

                      {/* Join Code */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-foreground bg-muted/60 px-2 py-1 rounded-md border">
                            {classroom.code}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => copyCode(classroom.code, classroom.id)}
                            className="h-7 w-7"
                            title="Copy Join Code"
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-foreground" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </td>

                      {/* Students Count */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-foreground">{studentCount}</span>
                        <span className="text-muted-foreground ml-1">students</span>
                      </td>

                      {/* Scenarios Count */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-foreground">{assignedScenarios.length}</span>
                        <span className="text-muted-foreground ml-1">assigned</span>
                      </td>

                      {/* Teams Count */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-foreground">{groupCount}</span>
                        <span className="text-muted-foreground ml-1">groups</span>
                      </td>

                      {/* Created */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground text-[11px]">
                        {format(new Date(classroom.createdAt), "MMM d, yyyy")}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <ClassroomRosterDrawer
                            classroom={classroom}
                            students={students}
                            scenarios={assignedScenarios}
                            allScenarios={allScenarios}
                            groups={groups}
                            submissions={submissions}
                            trigger={
                              <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                                <Users className="h-3.5 w-3.5" />
                                <span>Roster</span>
                              </Button>
                            }
                          />

                          <EditClassroomDialog classroom={classroom} />

                          <DeleteClassroomDialog
                            classroomId={classroom.id}
                            classroomName={classroom.name}
                            studentCount={studentCount}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
