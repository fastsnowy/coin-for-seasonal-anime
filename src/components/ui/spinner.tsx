import type * as React from "react";

import { cn } from "@/lib/utils";

type SpinnerProps = Omit<React.ComponentProps<"svg">, "children"> & {
  /**
   * Accessible label. When provided the spinner is announced as a status
   * region (role="status"); otherwise it is decorative (aria-hidden).
   */
  label?: string;
};

/**
 * Small circular spinner that inherits `currentColor` and font-size-agnostic
 * sizing (default 1rem; override with `size-*`). Under reduced motion it keeps
 * turning, but slower, so loading is still perceivable.
 */
function Spinner({ label, className, ...props }: SpinnerProps) {
  const svg = (
    <svg
      data-slot="spinner"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 animate-spin motion-reduce:[animation-duration:1.6s]",
        className,
      )}
      {...props}
    >
      <circle
        cx="8"
        cy="8"
        r="6.25"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1.75"
      />
      <path
        d="M14.25 8A6.25 6.25 0 0 0 8 1.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );

  if (!label) return svg;

  return (
    <span role="status" className="inline-flex items-center">
      {svg}
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { Spinner };
export type { SpinnerProps };
