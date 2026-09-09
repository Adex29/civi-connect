"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, FileText } from "lucide-react";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/dashboard/classrooms", label: "Classrooms", icon: Users },
  { href: "/admin/dashboard/scenarios", label: "Mission Library", icon: BookOpen },
  { href: "/admin/dashboard/submissions", label: "Submissions", icon: FileText },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-2 text-sm font-bold">
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all border ${
              isActive
                ? "border-surface-border bg-card text-primary shadow-xs"
                : "border-transparent text-muted-foreground hover:border-surface-border/60 hover:bg-card/50 hover:text-foreground hover:shadow-2xs"
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-primary" : ""}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
