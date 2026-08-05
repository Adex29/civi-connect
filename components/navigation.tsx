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
    { href: "/admin/dashboard/scenarios", label: "Scenario Library", icon: BookOpen },
    { href: "/admin/dashboard/submissions", label: "Submissions", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-14 items-center justify-between">
        
        {/* Desktop Brand & Nav */}
        <div className="mr-4 hidden md:flex items-center space-x-6">
          <Link href={role === "admin" ? "/admin/dashboard" : "/dashboard"} className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary via-primary/80 to-indigo-600 bg-clip-text text-transparent">
              Civi-Tech
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href={role === "admin" ? "/admin/dashboard" : "/dashboard"}
              className={`transition-colors hover:text-foreground/80 ${
                pathname === (role === "admin" ? "/admin/dashboard" : "/dashboard") ? "text-foreground" : "text-foreground/60"
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
                <Button variant="ghost" size="icon-sm" aria-label="Open Mobile Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <DrawerContent side="left" className="w-72 p-0">
              <DrawerHeader className="p-4 border-b text-left">
                <DrawerTitle className="text-xl font-bold text-primary">Civi-Tech</DrawerTitle>
              </DrawerHeader>

              <div className="p-4 space-y-1">
                {role === "admin" ? (
                  adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground font-semibold"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md bg-accent text-accent-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                    Dashboard
                  </Link>
                )}
              </div>

              <div className="mt-auto p-4 border-t">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
          
          <Link href={role === "admin" ? "/admin/dashboard" : "/dashboard"} className="font-bold text-base">
            Civi-Tech
          </Link>
        </div>

        {/* Right Action */}
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
