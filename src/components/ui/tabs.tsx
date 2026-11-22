"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useGlidingIndicator } from "./use-gliding-indicator";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & {
  /**
   * `tray` (default): gray track with a raised pill that glides between tabs.
   * `underline`: text tabs on a hairline with a sliding line.
   */
  variant?: "tray" | "underline";
};

function TabsList({
  className,
  variant = "tray",
  children,
  ref,
  ...props
}: TabsListProps) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);

  useGlidingIndicator(
    listRef,
    indicatorRef,
    '[role="tab"][data-state="active"]',
    { axis: variant === "underline" ? "x" : "both" },
  );

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <TabsPrimitive.List
      ref={setRefs}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        "group/tabs-list relative isolate inline-flex w-fit items-center justify-center text-muted-foreground",
        variant === "tray" && "h-9 rounded-lg bg-muted p-[3px]",
        variant === "underline" &&
          "h-10 gap-4 border-b border-border bg-transparent",
        className,
      )}
      {...props}
    >
      <span
        ref={indicatorRef}
        aria-hidden="true"
        data-slot="tabs-indicator"
        className={cn(
          "pointer-events-none absolute top-0 left-0 -z-10 opacity-0 group-data-[indicator=ready]/tabs-list:opacity-100",
          "group-data-[indicator=ready]/tabs-list:transition-[translate,width,height] group-data-[indicator=ready]/tabs-list:duration-300 group-data-[indicator=ready]/tabs-list:ease-out-quint motion-reduce:transition-none!",
          variant === "tray" &&
            "rounded-md border border-border bg-card shadow-sm dark:border-input dark:bg-input/40",
          variant === "underline" && "top-auto! bottom-[-1px] h-0.5! rounded-full bg-foreground",
        )}
      />
      {children}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-200 ease-out-quint outline-none",
        "text-muted-foreground hover:text-foreground data-[state=active]:text-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/35",
        "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Fallback active styling until the gliding indicator has measured
        // (first paint / no JS). Once ready, the indicator draws the pill.
        "group-data-[variant=tray]/tabs-list:data-[state=active]:bg-card group-data-[variant=tray]/tabs-list:data-[state=active]:shadow-sm dark:group-data-[variant=tray]/tabs-list:data-[state=active]:bg-input/40",
        "group-data-[indicator=ready]/tabs-list:data-[state=active]:bg-transparent! group-data-[indicator=ready]/tabs-list:data-[state=active]:shadow-none!",
        "group-data-[variant=underline]/tabs-list:h-full group-data-[variant=underline]/tabs-list:flex-none group-data-[variant=underline]/tabs-list:rounded-none group-data-[variant=underline]/tabs-list:px-1",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
