"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"

import { cn } from "@/lib/utils"

function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-closed:opacity-0 data-open:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  side = "bottom",
  ...props
}: DrawerPrimitive.Popup.Props & { side?: "bottom" | "top" | "left" | "right" }) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Viewport className="fixed inset-0 z-50 pointer-events-none">
        <DrawerPrimitive.Popup
          data-slot="drawer-content"
          className={cn(
            "pointer-events-auto fixed z-50 flex flex-col bg-background shadow-2xl transition-transform duration-300 ease-in-out outline-none",
            side === "bottom" && "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t p-6 data-starting-style:translate-y-full data-ending-style:translate-y-full data-closed:translate-y-full data-open:translate-y-0",
            side === "right" && "inset-y-0 right-0 h-full w-full max-w-sm border-l p-6 sm:max-w-md data-starting-style:translate-x-full data-ending-style:translate-x-full data-closed:translate-x-full data-open:translate-x-0",
            side === "left" && "inset-y-0 left-0 h-full w-full max-w-sm border-r p-6 sm:max-w-md data-starting-style:-translate-x-full data-ending-style:-translate-x-full data-closed:-translate-x-full data-open:translate-x-0",
            side === "top" && "inset-x-0 top-0 max-h-[85vh] rounded-b-2xl border-b p-6 data-starting-style:-translate-y-full data-ending-style:-translate-y-full data-closed:-translate-y-full data-open:translate-y-0",
            className
          )}
          {...props}
        >
          {side === "bottom" && (
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
          )}
          {children}
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
