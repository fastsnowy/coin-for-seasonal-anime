"use client";

import { NumberRoll } from "@/components/ui/number-roll";
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
  /** Used to build accessible names, e.g. the anime title. */
  label?: string;
  /** Shows a segmented meter of value / max under the count. */
  showMeter?: boolean;
  size?: "sm" | "md";
  onValueChange?: (value: number | undefined) => void;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const stepButton = cn(
  "relative flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none select-none",
  "transition-[scale,background-color,border-color,color,opacity,box-shadow] duration-150 ease-out-quint",
  "active:not-disabled:scale-90 motion-reduce:active:scale-100",
  "focus-visible:ring-[3px] focus-visible:ring-ring/35",
  "disabled:cursor-not-allowed disabled:opacity-35",
  // Expand the hit area by 4px on each side without changing the visual size.
  "after:absolute after:-inset-1 after:content-['']",
);

export const NumberInput = ({
  stepper = 10,
  defaultValue = 0,
  min = 0,
  max = 100,
  value: controlledValue,
  onValueChange,
  disabled = false,
  label,
  showMeter = true,
  size = "md",
}: NumberInputProps) => {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : uncontrolledValue;
  const coinRef = useRef<HTMLSpanElement>(null);
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
    if (value > prevRef.current && coinRef.current && !prefersReducedMotion()) {
      coinRef.current.classList.remove("animate-coin-bounce");
      void coinRef.current.offsetWidth;
      coinRef.current.classList.add("animate-coin-bounce");
    }
    prevRef.current = value;
  }, [value]);

  const isActive = value > 0;
  const segments = Math.max(1, Math.round((max - min) / stepper));
  const filled = Math.round((value - min) / stepper);
  const subject = label ? `「${label}」の` : "";
  const buttonSize = size === "sm" ? "size-8" : "size-9";

  return (
    <fieldset
      aria-label={label ? `${label}に投じるコイン` : "投じるコイン"}
      className="m-0 flex w-full min-w-0 items-center justify-between gap-2 border-0 p-0"
    >
      <button
        type="button"
        onClick={() => update(value - stepper)}
        disabled={disabled || value <= min}
        aria-label={`${subject}コインを${stepper}減らす`}
        className={cn(
          stepButton,
          buttonSize,
          "border border-border-strong bg-card text-foreground/80 shadow-xs hover:bg-accent hover:text-foreground",
        )}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
        <output
          aria-live="polite"
          className={cn(
            "flex items-center justify-center gap-1.5 transition-colors duration-200",
            isActive ? "text-coin-foreground" : "text-muted-foreground/70",
          )}
        >
          <span className="sr-only">{`${value}コイン`}</span>
          <span ref={coinRef} className="inline-flex">
            <Coins
              className={cn(
                "size-4 shrink-0 transition-colors duration-200",
                isActive ? "text-coin" : "text-muted-foreground/50",
              )}
              aria-hidden="true"
            />
          </span>
          <NumberRoll
            value={value}
            duration={450}
            aria-hidden="true"
            className={cn(
              "font-semibold leading-none",
              size === "sm" ? "text-sm" : "text-base",
            )}
          />
        </output>

        {showMeter && (
          <div aria-hidden="true" className="flex w-full max-w-28 gap-[3px]">
            {Array.from({ length: segments }, (_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length meter
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-300 ease-out-quint",
                  i < filled ? "bg-coin" : "bg-muted",
                )}
                style={{ transitionDelay: `${i < filled ? i * 12 : 0}ms` }}
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => update(value + stepper)}
        disabled={disabled || value >= max}
        aria-label={`${subject}コインを${stepper}増やす`}
        className={cn(
          stepButton,
          buttonSize,
          isActive
            ? "bg-primary text-primary-foreground shadow-[var(--highlight-inset),var(--elevation-xs)] hover:bg-primary/90"
            : "border border-coin/30 bg-coin-muted text-coin-foreground hover:bg-coin/18",
        )}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </fieldset>
  );
};
