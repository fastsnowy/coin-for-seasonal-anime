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
  onValueChange?: (value: number | undefined) => void;
}

export const NumberInput = ({
  stepper = 10,
  defaultValue = 0,
  min = 0,
  max = 100,
  value: controlledValue,
  onValueChange,
}: NumberInputProps) => {
  const [value, setValue] = useState<number>(controlledValue ?? defaultValue);
  const coinRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef(value);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const update = useCallback(
    (next: number) => {
      const clamped = Math.max(min, Math.min(max, next));
      setValue(clamped);
      onValueChange?.(clamped);
    },
    [min, max, onValueChange],
  );

  useEffect(() => {
    if (value !== prevRef.current && value > 0 && coinRef.current) {
      coinRef.current.classList.remove("animate-coin-bounce");
      void coinRef.current.offsetWidth;
      coinRef.current.classList.add("animate-coin-bounce");
    }
    prevRef.current = value;
  }, [value]);

  const isActive = value > 0;

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <button
        type="button"
        onClick={() => update(value - stepper)}
        disabled={value <= min}
        className={cn(
          "h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 active:scale-90",
          "border border-border bg-secondary text-secondary-foreground",
          "disabled:opacity-30 disabled:pointer-events-none",
          "hover:bg-muted",
        )}
      >
        <Minus className="h-3 w-3" />
      </button>

      <div
        ref={coinRef}
        className={cn(
          "flex items-center justify-center gap-1.5 min-w-14 transition-opacity duration-200",
          isActive ? "opacity-100" : "opacity-35",
        )}
      >
        <Coins className="h-3.5 w-3.5 shrink-0" />
        <span
          className={cn(
            "font-bold text-base tabular-nums transition-colors duration-200",
            isActive ? "text-coin" : "text-muted-foreground",
          )}
        >
          {value}
        </span>
      </div>

      <button
        type="button"
        onClick={() => update(value + stepper)}
        disabled={value >= max}
        className={cn(
          "h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 active:scale-90",
          "border border-border bg-secondary text-secondary-foreground",
          "disabled:opacity-30 disabled:pointer-events-none",
          "hover:bg-muted",
          isActive && "border-coin/30 bg-coin-muted text-coin hover:bg-coin-muted",
        )}
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
};
