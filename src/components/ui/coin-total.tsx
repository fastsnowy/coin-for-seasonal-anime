"use client";

import { useEffect, useState } from "react";
import { NumberRoll } from "@/components/ui/number-roll";

/**
 * Odometer that rolls up from 0 to `value` once mounted (instant under
 * prefers-reduced-motion, handled by NumberRoll).
 */
export function CoinTotal({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <>
      {/* Announce the real total, not the intermediate 0. */}
      <span className="sr-only">{value.toLocaleString("ja-JP")}</span>
      <NumberRoll
        value={shown}
        duration={1100}
        aria-hidden="true"
        className={className}
      />
    </>
  );
}
