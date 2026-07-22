"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function Navigation({ role }: { role: "student" | "admin" }) {
  const pathname = usePathname();
  
  const handleLogout = async () => {
    await logoutAction(role === "admin");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href={role === "admin" ? "/admin/dashboard" : "/dashboard"} className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              CiviConnect
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
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add search here if needed */}
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
