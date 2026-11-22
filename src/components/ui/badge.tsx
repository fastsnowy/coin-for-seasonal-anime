import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium leading-4 transition-[color,background-color,box-shadow] [&>svg]:pointer-events-none [&>svg]:size-3 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-accent",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/25 dark:bg-destructive/80",
        outline:
          "border-border-strong bg-card/60 text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        /** Soft gold tint (brand). */
        soft: "border-coin/15 bg-coin-muted text-coin-foreground [a&]:hover:bg-coin/18",
        /** Soft neutral tint. */
        neutral:
          "border-border bg-muted text-muted-foreground [a&]:hover:text-foreground",
        /** Soft green tint. */
        success:
          "border-success/15 bg-success-muted text-success [a&]:hover:bg-success/18",
        /** Soft red tint. */
        danger:
          "border-destructive/15 bg-destructive-muted text-destructive [a&]:hover:bg-destructive/16",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
