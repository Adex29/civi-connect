import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function ActivityLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Banner Skeleton */}
      <div className="rounded-xl border border-border/60 bg-card p-4 md:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-7 w-64 md:w-96 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>

      {/* Step Tracker Timeline Skeleton */}
      <div className="rounded-xl border border-border/50 bg-card/60 p-4 shadow-xs">
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-md hidden sm:block" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Left, Tips Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Form Area */}
        <div className="lg:col-span-8 rounded-xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-xs">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-7 w-full max-w-md rounded-lg" />
          </div>

          <div className="space-y-4 pt-2">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
        </div>

        {/* Right Sidebar: Tips & Context Area */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-border/60 bg-card p-5 space-y-3 shadow-xs">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-4/6 rounded-md" />
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3 shadow-xs">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
