import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function AdminDashboardLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8 space-y-8 animate-in fade-in-50 duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <Skeleton className="h-7 w-64 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card p-5 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Content Card Skeleton */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-lg border border-border/40"
            >
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-44 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
              <Skeleton className="h-7 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
