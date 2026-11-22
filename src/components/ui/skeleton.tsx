import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Placeholder block with a soft shimmer sweep (static under reduced motion).
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("bg-muted shimmer rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
