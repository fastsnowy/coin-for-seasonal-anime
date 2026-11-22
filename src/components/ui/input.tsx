import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/80 selection:bg-coin-muted selection:text-foreground dark:bg-input/30 border-input bg-card flex h-9 w-full min-w-0 rounded-lg border px-3 py-1 text-base shadow-xs transition-[color,background-color,border-color,box-shadow] duration-150 ease-out-quint outline-none hover:border-border-strong file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring/70 focus-visible:ring-ring/25 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
