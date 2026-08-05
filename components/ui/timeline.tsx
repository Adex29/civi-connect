import * as React from "react";
import { cn } from "@/lib/utils";

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  activeIndex?: number;
}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, activeIndex, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn("flex flex-col relative", className)}
      {...props}
    />
  )
);
Timeline.displayName = "Timeline";

const TimelineItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("relative grid grid-cols-[auto_1fr] gap-x-4 items-start pb-6 last:pb-0 group", className)}
    {...props}
  />
));
TimelineItem.displayName = "TimelineItem";

export interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "completed" | "current" | "upcoming";
}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, status = "upcoming", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-200 shadow-xs",
          status === "completed" && "bg-emerald-500 text-white border-emerald-500",
          status === "current" && "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20 animate-pulse",
          status === "upcoming" && "bg-card text-muted-foreground border-border/80 opacity-90",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TimelineDot.displayName = "TimelineDot";

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "absolute left-[13.5px] top-3 -bottom-6 w-[2px] -translate-x-1/2 bg-border/80 group-last:hidden z-0",
      className
    )}
    {...props}
  />
));
TimelineConnector.displayName = "TimelineConnector";

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1 min-w-0 pt-0.5", className)}
    {...props}
  />
));
TimelineContent.displayName = "TimelineContent";

const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-wrap items-center justify-between gap-2", className)}
    {...props}
  />
));
TimelineHeader.displayName = "TimelineHeader";

const TimelineTime = React.forwardRef<
  HTMLTimeElement,
  React.TimeHTMLAttributes<HTMLTimeElement>
>(({ className, ...props }, ref) => (
  <time
    ref={ref}
    className={cn("text-[11px] font-mono text-muted-foreground", className)}
    {...props}
  />
));
TimelineTime.displayName = "TimelineTime";

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-sm font-bold leading-tight text-foreground tracking-tight", className)}
    {...props}
  />
));
TimelineTitle.displayName = "TimelineTitle";

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground leading-relaxed mt-0.5", className)}
    {...props}
  />
));
TimelineDescription.displayName = "TimelineDescription";

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
};
