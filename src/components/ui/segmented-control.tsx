"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useGlidingIndicator } from "./use-gliding-indicator";

type SegmentOption<T extends string = string> = {
  value: T;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Accessible name when `label` is not plain text (or icon-only). */
  ariaLabel?: string;
};

type SegmentedControlProps<T extends string = string> = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue" | "children"
> & {
  options: readonly SegmentOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  /** 28 / 32 / 40px tall segments. */
  size?: "sm" | "md" | "lg";
  /** Equal-width segments spanning the container. */
  fullWidth?: boolean;
  disabled?: boolean;
};

const sizeClasses = {
  sm: "h-7 px-2.5 text-xs gap-1",
  md: "h-8 px-3 text-sm gap-1.5",
  lg: "h-10 px-4 text-sm gap-2",
} as const;

/**
 * Radio-group style segmented control with a raised pill that glides to the
 * selected option. Single tab stop (roving tabindex); Arrow keys move and
 * select (wrapping, skipping disabled options), Home/End jump to the ends.
 */
function SegmentedControl<T extends string = string>({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = "md",
  fullWidth = false,
  disabled = false,
  className,
  ...props
}: SegmentedControlProps<T>) {
  const firstEnabled = options.find((o) => !o.disabled)?.value;
  const [uncontrolled, setUncontrolled] = React.useState<T | undefined>(
    defaultValue ?? firstEnabled,
  );
  const value = valueProp ?? uncontrolled;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  useGlidingIndicator(
    containerRef,
    indicatorRef,
    '[role="radio"][aria-checked="true"]',
  );

  const select = (next: T) => {
    if (next === value) return;
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const enabledIndexes = options
    .map((o, i) => (o.disabled || disabled ? -1 : i))
    .filter((i) => i >= 0);

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (enabledIndexes.length === 0) return;
    const current = options.findIndex((o) => o.value === value);
    const pos = enabledIndexes.indexOf(current);
    let nextIndex: number | undefined;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = enabledIndexes[(pos + 1) % enabledIndexes.length];
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex =
          enabledIndexes[
            (pos - 1 + enabledIndexes.length) % enabledIndexes.length
          ];
        break;
      case "Home":
        nextIndex = enabledIndexes[0];
        break;
      case "End":
        nextIndex = enabledIndexes[enabledIndexes.length - 1];
        break;
      default:
        return;
    }

    event.preventDefault();
    const option = options[nextIndex];
    if (!option) return;
    select(option.value);
    itemRefs.current[nextIndex]?.focus();
  };

  // Roving tabindex: the checked option, or the first enabled one.
  const checkedIndex = options.findIndex((o) => o.value === value);
  const tabStop =
    checkedIndex >= 0 && enabledIndexes.includes(checkedIndex)
      ? checkedIndex
      : enabledIndexes[0];

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-disabled={disabled || undefined}
      data-slot="segmented-control"
      className={cn(
        "relative isolate items-center rounded-lg bg-muted p-[3px]",
        fullWidth ? "grid w-full auto-cols-fr grid-flow-col" : "inline-flex w-fit",
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-0 left-0 -z-10 rounded-md border border-border bg-card opacity-0 shadow-sm dark:border-input dark:bg-input/40",
          "in-data-[indicator=ready]:opacity-100 in-data-[indicator=ready]:transition-[translate,width,height] in-data-[indicator=ready]:duration-300 in-data-[indicator=ready]:ease-out-quint motion-reduce:transition-none!",
        )}
      />
      {options.map((option, index) => {
        const checked = option.value === value;
        const isDisabled = disabled || option.disabled;
        return (
          <button
            key={option.value}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={option.ariaLabel}
            disabled={isDisabled}
            tabIndex={index === tabStop ? 0 : -1}
            data-state={checked ? "checked" : "unchecked"}
            onClick={() => select(option.value)}
            onKeyDown={onKeyDown}
            className={cn(
              "inline-flex cursor-pointer items-center justify-center rounded-md font-medium whitespace-nowrap outline-none select-none",
              "transition-[color,scale] duration-200 ease-out-quint active:scale-[0.97] motion-reduce:active:scale-100",
              "text-muted-foreground hover:text-foreground aria-checked:text-foreground",
              // Fallback pill until the gliding indicator has measured.
              "aria-checked:bg-card aria-checked:shadow-sm dark:aria-checked:bg-input/40 in-data-[indicator=ready]:aria-checked:bg-transparent! in-data-[indicator=ready]:aria-checked:shadow-none!",
              "focus-visible:ring-[3px] focus-visible:ring-ring/35",
              "disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              sizeClasses[size],
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export { SegmentedControl };
export type { SegmentOption, SegmentedControlProps };
