"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toasts on the neutral popover surface with a hairline border and soft
 * layered shadow. Status is conveyed by a tinted border + colored icon rather
 * than a full colored background (this also tames `richColors`).
 *
 * Note: sonner injects unlayered CSS, so properties it sets directly
 * (shadow, font, icon color) need `!` to win over Tailwind's layered
 * utilities. Colors are driven through sonner's own CSS variables instead.
 */
const STATUS_TONES = {
  success: "var(--success)",
  error: "var(--destructive)",
  warning: "var(--coin)",
  info: "var(--border-strong)",
} as const;

const statusVars = Object.fromEntries(
  Object.entries(STATUS_TONES).flatMap(([tone, color]) => [
    [`--${tone}-bg`, "var(--popover)"],
    [`--${tone}-text`, "var(--popover-foreground)"],
    [`--${tone}-border`, `color-mix(in oklch, ${color} 35%, var(--border))`],
  ]),
);

const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      gap={10}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-xl)",
          ...statusVars,
        } as React.CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast:
            "font-sans! shadow-lg! gap-3! px-4! py-3.5! text-[13px]! leading-snug",
          title: "font-semibold! text-[13px]!",
          description: "text-muted-foreground! text-xs! leading-relaxed!",
          icon: "[[data-type=success]_&]:text-success! [[data-type=error]_&]:text-destructive! [[data-type=warning]_&]:text-coin-foreground! [[data-type=info]_&]:text-muted-foreground!",
          actionButton:
            "bg-inverse! text-inverse-foreground! rounded-md! font-medium!",
          cancelButton: "bg-muted! text-muted-foreground! rounded-md!",
          closeButton:
            "bg-popover! border-border! text-muted-foreground! hover:text-foreground!",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
