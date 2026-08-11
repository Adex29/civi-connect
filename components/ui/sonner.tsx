"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CheckCircle2, Info, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        info: <Info className="h-4 w-4 text-primary shrink-0" />,
        warning: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />,
        error: <AlertCircle className="h-4 w-4 text-destructive shrink-0" />,
        loading: <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-sans text-xs sm:text-sm p-4",
          title: "font-semibold text-foreground text-xs sm:text-sm",
          description: "group-[.toast]:text-muted-foreground text-xs leading-relaxed",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80 font-medium text-xs px-3 py-1.5 rounded-lg transition-colors",
          closeButton:
            "group-[.toast]:bg-background group-[.toast]:text-muted-foreground group-[.toast]:border-border group-[.toast]:hover:text-foreground",
          success:
            "group-[.toaster]:bg-card group-[.toaster]:border-emerald-500/30 group-[.toaster]:text-foreground dark:group-[.toaster]:border-emerald-500/40",
          error:
            "group-[.toaster]:bg-card group-[.toaster]:border-destructive/30 group-[.toaster]:text-foreground dark:group-[.toaster]:border-destructive/40",
          warning:
            "group-[.toaster]:bg-card group-[.toaster]:border-amber-500/30 group-[.toaster]:text-foreground dark:group-[.toaster]:border-amber-500/40",
          info:
            "group-[.toaster]:bg-card group-[.toaster]:border-primary/30 group-[.toaster]:text-foreground dark:group-[.toaster]:border-primary/40",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
