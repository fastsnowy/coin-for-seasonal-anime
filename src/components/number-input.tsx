"use client";

import { cn } from "@/lib/utils";
import { Coins, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface NumberInputProps {
  stepper?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number;
  disabled?: boolean;
  onValueChange?: (value: number | undefined) => void;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const NumberInput = ({
  stepper = 10,
  defaultValue = 0,
  min = 0,
  max = 100,
  value: controlledValue,
  onValueChange,
  disabled = false,
}: NumberInputProps) => {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : uncontrolledValue;
  const coinRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef(value);

  const update = useCallback(
    (next: number) => {
      const clamped = Math.max(min, Math.min(max, next));
      if (!isControlled) {
        setUncontrolledValue(clamped);
      }
      onValueChange?.(clamped);
    },
    [isControlled, min, max, onValueChange],
  );

  useEffect(() => {
    if (value !== prevRef.current && value > 0 && coinRef.current) {
      if (!prefersReducedMotion()) {
        coinRef.current.classList.remove("animate-coin-bounce");
        void coinRef.current.offsetWidth;
        coinRef.current.classList.add("animate-coin-bounce");
      }
    }
    prevRef.current = value;
  }, [value]);

  const isActive = value > 0;

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <button
        type="button"
        onClick={() => update(value - stepper)}
        disabled={disabled || value <= min}
        aria-label="コインを減らす"
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md duration-150",
          "transition-[transform,background-color,border-color,opacity] active:scale-90",
          "border border-border bg-secondary text-secondary-foreground",
          "disabled:pointer-events-none disabled:opacity-30",
          "hover:bg-muted",
        )}
      >
        <Minus className="h-3 w-3" aria-hidden="true" />
      </button>

      <div
        ref={coinRef}
        className={cn(
          "flex min-w-14 items-center justify-center gap-1.5 transition-opacity duration-200",
          isActive ? "opacity-100" : "opacity-35",
        )}
      >
        <Coins className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span
          className={cn(
            "text-base font-bold tabular-nums transition-colors duration-200",
            isActive ? "text-coin" : "text-muted-foreground",
          )}
          aria-live="polite"
        >
          {value}
        </span>
      </div>

      <button
        type="button"
        onClick={() => update(value + stepper)}
        disabled={disabled || value >= max}
        aria-label="コインを増やす"
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md duration-150",
          "transition-[transform,background-color,border-color,opacity] active:scale-90",
          "border border-border bg-secondary text-secondary-foreground",
          "disabled:pointer-events-none disabled:opacity-30",
          "hover:bg-muted",
          isActive && "border-coin/30 bg-coin-muted text-coin hover:bg-coin-muted",
        )}
      >
        <Plus className="h-3 w-3" aria-hidden="true" />
      </button>
    </div>
  );
};
