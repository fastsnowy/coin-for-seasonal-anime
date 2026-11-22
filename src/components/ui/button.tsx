import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium select-none",
    "transition-[color,background-color,border-color,box-shadow,opacity,scale] duration-150 ease-out-quint",
    "active:not-disabled:not-aria-busy:scale-[var(--press-scale)] motion-reduce:active:scale-100",
    "disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:ring-offset-0",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  ],
  {
    variants: {
      variant: {
        /** Brand accent (coin gold). */
        default:
          "bg-primary text-primary-foreground shadow-[var(--highlight-inset),var(--elevation-xs)] hover:bg-primary/90",
        /** Neutral dark-filled primary (affectUI style). Inverts in dark mode. */
        solid:
          "bg-inverse text-inverse-foreground shadow-[var(--highlight-inset),var(--elevation-xs)] hover:bg-inverse/88",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/25 dark:bg-destructive/80",
        /** White, hairline-outlined secondary action. */
        outline:
          "border border-border-strong bg-card text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/40 dark:hover:bg-input/70",
        /** Soft neutral fill. */
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent",
        /** Soft gold tint — quieter brand action. */
        soft: "bg-coin-muted text-coin-foreground hover:bg-coin/18",
        ghost:
          "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        /** 36px — kept for backward compatibility. */
        default: "h-9 px-4 has-[>svg]:px-3",
        /** 32px */
        sm: "h-8 gap-1.5 rounded-md px-3 text-[13px] has-[>svg]:px-2.5",
        /** 40px */
        md: "h-10 px-4 has-[>svg]:px-3.5",
        /** 48px */
        lg: "h-12 rounded-xl px-6 text-[15px] has-[>svg]:px-5",
        icon: "size-9",
        "icon-sm": "size-8 rounded-md",
        "icon-md": "size-10",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /**
     * Shows a spinner in place of `icon`, sets aria-busy and ignores clicks.
     * The button stays focusable (it is not disabled). Client components only
     * (it attaches a click guard).
     */
    loading?: boolean;
    /** Leading icon. Replaced by a spinner while `loading`. */
    icon?: React.ReactNode;
    /** Trailing icon. */
    iconRight?: React.ReactNode;
  };

function preventWhileLoading(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
  event.stopPropagation();
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  icon,
  iconRight,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (asChild) {
    return (
      <Slot
        data-slot="button"
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
        className={classes}
        onClick={loading ? preventWhileLoading : onClick}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  const leading = loading ? <Spinner /> : icon;

  return (
    <button
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      className={classes}
      onClick={loading ? preventWhileLoading : onClick}
      {...props}
    >
      {leading}
      {children}
      {iconRight}
    </button>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
