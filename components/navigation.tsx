"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, LayoutDashboard, Users, BookOpen, FileText, LogOut } from "lucide-react";

export function Navigation({ role }: { role: "student" | "admin" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  const handleLogout = async () => {
    await logoutAction(role === "admin");
  };

  const adminNavItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/dashboard/classrooms", label: "Classrooms", icon: Users },
    { href: "/admin/dashboard/scenarios", label: "Mission Library", icon: BookOpen },
    { href: "/admin/dashboard/submissions", label: "Submissions", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 shadow-xs backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="container mx-auto flex h-18 items-center justify-between px-4 md:px-8">
        
        {/* Desktop Brand & Nav */}
        <div className="mr-4 hidden items-center gap-8 md:flex">
          <Link href={role === "admin" ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground shadow-xs border border-primary/20">CT</span>
            <span className="text-lg font-black leading-none tracking-tight text-foreground">Civi-Tech</span>
          </Link>
          <nav className="flex items-center text-sm font-bold">
            <Link
              href={role === "admin" ? "/admin/dashboard" : "/dashboard"}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-extrabold tracking-wide uppercase transition-all border ${
                pathname === (role === "admin" ? "/admin/dashboard" : "/dashboard")
                  ? "border-surface-border bg-card text-primary shadow-xs"
                  : "border-transparent text-muted-foreground hover:border-surface-border/60 hover:bg-card/50 hover:text-foreground hover:shadow-2xs"
              }`}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation Drawer Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger
              render={
                <Button variant="outline" size="icon-sm" className="shadow-xs border-border" aria-label="Open Mobile Menu">
                  <Menu className="h-4 w-4" />
                </Button>
              }
            />
            <DrawerContent side="left" className="w-72 p-0">
              <DrawerHeader className="p-4 border-b text-left">
                <DrawerTitle className="flex items-center gap-3 text-xl font-black text-primary">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground shadow-xs">CT</span>
                  <span>Civi-Tech</span>
                </DrawerTitle>
              </DrawerHeader>

              <div className="p-4 space-y-1.5">
                {role === "admin" ? (
                  adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold rounded-lg transition-all border ${
                          isActive
                            ? "border-surface-border bg-card text-primary shadow-xs"
                            : "border-transparent text-muted-foreground hover:border-surface-border/60 hover:bg-card/50 hover:text-foreground hover:shadow-2xs"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                        {item.label}
                      </Link>
                    );
                  })
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold rounded-lg border border-surface-border bg-card text-primary shadow-xs"
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0 text-primary" />
                    Dashboard
                  </Link>
                )}
              </div>

              <div className="mt-auto p-4 border-t">
                <Button variant="outline" className="w-full justify-start gap-2 shadow-xs" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
          
          <Link href={role === "admin" ? "/admin/dashboard" : "/dashboard"} className="text-base font-black text-primary">
            Civi-Tech
          </Link>
        </div>

        {/* Right Action */}
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout} className="hidden gap-2 text-xs font-bold md:flex shadow-2xs hover:shadow-xs hover:border-primary/50">
            <LogOut className="size-3.5" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
