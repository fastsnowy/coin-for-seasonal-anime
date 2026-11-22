import type * as React from "react";

import { cn } from "@/lib/utils";

type NumberRollProps = Omit<React.ComponentProps<"span">, "children"> & {
  value: number;
  /** Intl.NumberFormat locale. Defaults to "ja-JP". */
  locale?: string;
  /** Intl.NumberFormat options (e.g. `{ maximumFractionDigits: 1 }`). */
  format?: Intl.NumberFormatOptions;
  /** Roll duration in ms. Defaults to 600. */
  duration?: number;
};

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

/**
 * Odometer-style number: each digit is a vertical strip that rolls to its new
 * value whenever `value` changes. Columns are keyed from the right so that
 * ones/tens/... stay stable when the number of digits changes.
 * Uses tabular figures; rolls are instant under prefers-reduced-motion.
 * Screen readers get the formatted value once (the strips are aria-hidden).
 */
function NumberRoll({
  value,
  locale = "ja-JP",
  format,
  duration = 600,
  className,
  style,
  ...props
}: NumberRollProps) {
  const formatted = new Intl.NumberFormat(locale, format).format(value);
  const chars = Array.from(formatted);

  return (
    <span
      data-slot="number-roll"
      className={cn("inline-flex tabular-nums", className)}
      style={
        { "--roll-duration": `${duration}ms`, ...style } as React.CSSProperties
      }
      {...props}
    >
      <span className="sr-only">{formatted}</span>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((char, i) => {
          const key = chars.length - i;
          const digit = DIGITS.indexOf(char as (typeof DIGITS)[number]);
          if (digit === -1) {
            return (
              <span key={`s${key}`} className="inline-block">
                {char}
              </span>
            );
          }
          return (
            <span
              key={`d${key}`}
              className="relative inline-block overflow-hidden"
            >
              <span className="invisible">0</span>
              <span
                className="absolute inset-x-0 top-0 flex flex-col items-center transition-transform duration-(--roll-duration) ease-out-expo motion-reduce:transition-none"
                style={{ transform: `translateY(-${digit * 10}%)` }}
              >
                {DIGITS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

export { NumberRoll };
export type { NumberRollProps };
