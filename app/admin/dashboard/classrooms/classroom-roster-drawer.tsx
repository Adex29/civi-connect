"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  BookOpen,
  Key,
  GraduationCap,
  Copy,
  Check,
  Search,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Archive,
  RefreshCw,
  Info,
} from "lucide-react";
import { Classroom, Student, Scenario, Group, Submission } from "@/lib/definitions";
import { toast } from "sonner";
import { format } from "date-fns";
import { EditClassroomDialog } from "./edit-classroom-dialog";
import { DeleteClassroomDialog } from "./delete-classroom-dialog";
import {
  toggleClassroomStatusAction,
  regenerateClassroomCodeAction,
  assignScenarioToClassroomAction,
  unassignScenarioFromClassroomAction,
} from "./actions";

interface ClassroomRosterDrawerProps {
  classroom: Classroom;
  students: Student[];
  scenarios: Scenario[];
  allScenarios?: Scenario[];
  groups?: Group[];
  submissions?: Submission[];
  trigger?: React.ReactNode;
}

export function ClassroomRosterDrawer({
  classroom,
  students,
  scenarios,
  allScenarios = [],
  groups = [],
  submissions = [],
  trigger,
}: ClassroomRosterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("students");
  const [copiedCode, setCopiedCode] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [assigningScenarioId, setAssigningScenarioId] = useState<string>("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);

  // Classroom-specific students
  const classroomStudents = useMemo(() => {
    return students.filter((s) => s.classroomId === classroom.id);
  }, [students, classroom.id]);

  // Classroom-specific groups
  const classroomGroups = useMemo(() => {
    return groups.filter((g) => g.classroomId === classroom.id);
  }, [groups, classroom.id]);

  // Available scenarios that are NOT yet assigned
  const availableToAssign = useMemo(() => {
    const assignedIds = new Set(scenarios.map((s) => s.id));
    return allScenarios.filter((s) => !assignedIds.has(s.id));
  }, [allScenarios, scenarios]);

  // Filtered students by search & group
  const filteredStudents = useMemo(() => {
    return classroomStudents.filter((st) => {
      if (studentSearch.trim()) {
        const query = studentSearch.toLowerCase();
        const matchesName = st.fullName.toLowerCase().includes(query);
        const matchesLrn = st.lrn.includes(query);
        if (!matchesName && !matchesLrn) return false;
      }

      if (groupFilter !== "all") {
        if (groupFilter === "ungrouped" && st.groupId) return false;
        if (groupFilter !== "ungrouped" && st.groupId !== groupFilter) return false;
      }

      return true;
    });
  }, [classroomStudents, studentSearch, groupFilter]);

  const copyCode = () => {
    navigator.clipboard.writeText(classroom.code);
    setCopiedCode(true);
    toast.success(`Join code "${classroom.code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleToggleStatus = async () => {
    const newStatus = classroom.status === "active" ? "archived" : "active";
    setStatusLoading(true);
    try {
      const res = await toggleClassroomStatusAction(classroom.id, newStatus);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Classroom marked as ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleRegenerateCode = async () => {
    setRegenLoading(true);
    try {
      const res = await regenerateClassroomCodeAction(classroom.id);
      if (res && "error" in res && res.error) {
        toast.error(res.error);
      } else if (res && "code" in res && res.code) {
        toast.success(`New join code generated: ${res.code}`);
      }
    } catch {
      toast.error("Failed to generate new code");
    } finally {
      setRegenLoading(false);
    }
  };

  const handleAssignScenario = async () => {
    if (!assigningScenarioId) return;
    setAssignLoading(true);
    try {
      const res = await assignScenarioToClassroomAction(assigningScenarioId, classroom.id);
      if (res && res.error) {
        toast.error(res.error);
      } else {
        toast.success("Mission assigned to classroom!");
        setAssigningScenarioId("");
      }
    } catch {
      toast.error("Failed to assign mission");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleUnassignScenario = async (scenarioId: string, title: string) => {
    try {
      const res = await unassignScenarioFromClassroomAction(scenarioId, classroom.id);
      if (res && res.error) {
        toast.error(res.error);
      } else {
        toast.success(`"${title}" unassigned from classroom`);
      }
    } catch {
      toast.error("Failed to unassign mission");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          trigger ? (
            (trigger as any)
          ) : (
            <Button variant="outline" size="sm" className="w-full gap-1.5 font-medium">
              <Users className="h-4 w-4" />
              <span>View Roster & Missions</span>
            </Button>
          )
        }
      />
      <DrawerContent side="right" className="w-full max-w-xl sm:max-w-2xl h-full flex flex-col p-0">
        {/* Drawer Header */}
        <DrawerHeader className="p-6 border-b shrink-0 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant={classroom.status === "active" ? "default" : "secondary"}
                  className="text-[11px] font-semibold"
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
                <span className="text-xs text-muted-foreground">
                  Created {format(new Date(classroom.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <DrawerTitle className="text-2xl font-extrabold tracking-tight">
                {classroom.name}
              </DrawerTitle>
            </div>

            {/* Quick Join Code Widget */}
            <div className="flex items-center gap-2 bg-card border rounded-lg p-1.5 px-3 shadow-xs">
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground block">
                  Join Code
                </span>
                <span className="font-mono text-base font-black tracking-wider text-foreground">
                  {classroom.code}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={copyCode}
                title="Copy Join Code"
                className="h-8 w-8 ml-1"
              >
                {copiedCode ? (
                  <Check className="h-4 w-4 text-foreground" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <DrawerDescription className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {classroom.description || "Manage student enrollment, assigned missions, and classroom collaboration settings."}
          </DrawerDescription>
        </DrawerHeader>

        {/* Drawer Body with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 border-b bg-background/50 sticky top-0 z-10">
            <TabsList variant="line" className="h-11 w-full justify-start gap-4">
              <TabsTrigger value="students" className="gap-1.5 text-xs font-semibold">
                <GraduationCap className="h-4 w-4" />
                <span>Students</span>
                <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
                  {classroomStudents.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="gap-1.5 text-xs font-semibold">
                <BookOpen className="h-4 w-4" />
                <span>Missions</span>
                <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
                  {scenarios.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="groups" className="gap-1.5 text-xs font-semibold">
                <Layers className="h-4 w-4" />
                <span>Teams</span>
                <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
                  {classroomGroups.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="share" className="gap-1.5 text-xs font-semibold">
                <Key className="h-4 w-4" />
                <span>Share & Controls</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: STUDENTS */}
            <TabsContent value="students" className="space-y-4 m-0 focus:outline-none">
              <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                <div className="relative flex-1 w-full sm:max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name or LRN..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>

                {classroomGroups.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground text-[11px]">Filter Team:</span>
                    <select
                      value={groupFilter}
                      onChange={(e) => setGroupFilter(e.target.value)}
                      className="h-8 rounded-md border bg-background px-2 text-xs text-foreground focus:outline-ring"
                    >
                      <option value="all">All Students ({classroomStudents.length})</option>
                      <option value="ungrouped">Individual / No Team</option>
                      {classroomGroups.map((g) => (
                        <option key={g.id} value={g.id}>
                          Team {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {filteredStudents.length === 0 ? (
                <div className="py-12 text-center border rounded-xl border-dashed bg-muted/20 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 max-w-xs mx-auto">
                    <p className="text-sm font-semibold">
                      {classroomStudents.length === 0 ? "No Students Enrolled Yet" : "No Matching Students"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {classroomStudents.length === 0
                        ? `Share join code "${classroom.code}" with your class to have students register.`
                        : "Try adjusting your search query or group filter."}
                    </p>
                  </div>
                  {classroomStudents.length === 0 && (
                    <Button size="sm" variant="outline" onClick={copyCode} className="gap-1.5 text-xs">
                      <Copy className="h-3.5 w-3.5" />
                      Copy Join Code
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground flex justify-between items-center px-1">
                    <span>Showing {filteredStudents.length} of {classroomStudents.length} students</span>
                    <span>Class Code: <strong className="font-mono text-foreground">{classroom.code}</strong></span>
                  </div>

                  <div className="divide-y border rounded-xl overflow-hidden bg-card shadow-2xs">
                    {filteredStudents.map((st) => {
                      const group = classroomGroups.find((g) => g.id === st.groupId);
                      return (
                        <div
                          key={st.id}
                          className="flex items-center justify-between p-3 px-4 hover:bg-muted/30 transition-colors text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                              {st.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground text-sm">{st.fullName}</p>
                              <div className="flex items-center gap-2 text-muted-foreground text-[11px] mt-0.5">
                                <span className="font-mono">LRN: {st.lrn}</span>
                                <span>•</span>
                                <span>Joined {format(new Date(st.createdAt), "MMM d, yyyy")}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {group ? (
                              <Badge variant="outline" className="text-[11px] font-medium bg-muted/40">
                                <Users className="h-3 w-3 mr-1 text-primary" />
                                {group.name}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-[11px] italic">Individual</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB 2: MISSIONS */}
            <TabsContent value="scenarios" className="space-y-4 m-0 focus:outline-none">
              {/* Quick Mission Assignment Bar */}
              {availableToAssign.length > 0 && (
                <div className="p-3.5 rounded-xl border bg-muted/30 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                  <div className="text-xs">
                    <p className="font-semibold text-foreground">Assign Civic Mission</p>
                    <p className="text-[11px] text-muted-foreground">Select a mission from your library</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={assigningScenarioId}
                      onChange={(e) => setAssigningScenarioId(e.target.value)}
                      className="h-8 rounded-md border bg-background px-2.5 text-xs text-foreground focus:outline-ring max-w-[200px]"
                    >
                      <option value="">Choose mission...</option>
                      {availableToAssign.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      onClick={handleAssignScenario}
                      disabled={!assigningScenarioId || assignLoading}
                      className="h-8 gap-1 text-xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Assign
                    </Button>
                  </div>
                </div>
              )}

              {scenarios.length === 0 ? (
                <div className="py-12 text-center border rounded-xl border-dashed bg-muted/20 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 max-w-xs mx-auto">
                    <p className="text-sm font-semibold">No Missions Assigned</p>
                    <p className="text-xs text-muted-foreground">
                      Assign a civic challenge or mission from your library for students to solve.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {scenarios.map((sc) => (
                    <div
                      key={sc.id}
                      className="p-4 rounded-xl border bg-card shadow-2xs hover:border-primary/40 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-foreground">{sc.title}</h4>
                            {sc.missionData && (
                              <Badge variant="outline" className="text-[10px]">
                                <Sparkles className="h-3 w-3 mr-1 text-primary" /> Civic Mission
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {sc.description}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleUnassignScenario(sc.id, sc.title)}
                          title="Unassign from classroom"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {sc.constraints && sc.constraints.length > 0 && (
                        <div className="pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{sc.constraints.length} Civic Constraint(s)</span>
                          <span className="text-primary font-medium">Ready</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* TAB 3: GROUPS & TEAMS */}
            <TabsContent value="groups" className="space-y-4 m-0 focus:outline-none">
              {classroomGroups.length === 0 ? (
                <div className="py-12 text-center border rounded-xl border-dashed bg-muted/20 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 max-w-xs mx-auto">
                    <p className="text-sm font-semibold">No Collaborative Teams Yet</p>
                    <p className="text-xs text-muted-foreground">
                      Students can create or join group names during registration to collaborate on civic missions.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {classroomGroups.map((g) => {
                    const members = classroomStudents.filter((s) => s.groupId === g.id);
                    return (
                      <div key={g.id} className="p-3.5 rounded-xl border bg-card shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-primary" />
                            Team {g.name}
                          </h5>
                          <Badge variant="secondary" className="text-[10px]">
                            {members.length} Member{members.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>

                        <div className="space-y-1 pt-1 border-t">
                          {members.length === 0 ? (
                            <p className="text-[11px] text-muted-foreground italic">No members assigned.</p>
                          ) : (
                            members.map((m) => (
                              <div key={m.id} className="text-xs text-muted-foreground flex justify-between">
                                <span className="font-medium text-foreground">{m.fullName}</span>
                                <span className="font-mono text-[10px]">{m.lrn}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* TAB 4: SHARE & CONTROLS */}
            <TabsContent value="share" className="space-y-5 m-0 focus:outline-none">
              {/* Join Code Spotlight */}
              <div className="p-5 rounded-xl border bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Key className="h-4 w-4 text-primary" />
                      Classroom Join Code
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Students enter this code when registering at the signup portal.
                    </p>
                  </div>
                  <Badge variant={classroom.status === "active" ? "default" : "secondary"}>
                    {classroom.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-lg bg-card border shadow-xs">
                  <div className="font-mono text-2xl font-black tracking-widest text-primary">
                    {classroom.code}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={copyCode}
                      className="gap-1.5 text-xs font-semibold shadow-xs"
                    >
                      {copiedCode ? <Check className="h-3.5 w-3.5 text-foreground" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRegenerateCode}
                      disabled={regenLoading}
                      title="Generate new 6-character code"
                      className="text-xs"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${regenLoading ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>Only active classrooms accept new student registrations.</span>
                </div>
              </div>

              {/* Classroom Administrative Actions */}
              <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Classroom Management & Status
                </h4>

                <div className="grid gap-2 sm:grid-cols-2">
                  {/* Edit Classroom */}
                  <EditClassroomDialog
                    classroom={classroom}
                    trigger={
                      <Button variant="outline" className="w-full justify-start gap-2 text-xs">
                        <EditClassroomDialog classroom={classroom} />
                        <span>Edit Name & Description</span>
                      </Button>
                    }
                  />

                  {/* Toggle Active/Archived */}
                  <Button
                    variant="outline"
                    onClick={handleToggleStatus}
                    disabled={statusLoading}
                    className="w-full justify-start gap-2 text-xs"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    <span>
                      {classroom.status === "active" ? "Archive Classroom" : "Reactivate Classroom"}
                    </span>
                  </Button>
                </div>

                <div className="pt-2 border-t">
                  <DeleteClassroomDialog
                    classroomId={classroom.id}
                    classroomName={classroom.name}
                    studentCount={classroomStudents.length}
                    trigger={
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Classroom Permanently</span>
                      </Button>
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Drawer Footer */}
        <DrawerFooter className="border-t p-4 px-6 bg-muted/20 shrink-0">
          <DrawerClose
            render={
              <Button variant="outline" className="w-full">
                Close
              </Button>
            }
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
