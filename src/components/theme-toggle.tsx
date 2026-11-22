"use client";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const options = [
  { value: "light", label: "ライト", icon: Sun },
  { value: "dark", label: "ダーク", icon: Moon },
  { value: "system", label: "システム", icon: Monitor },
] as const;

const iconTransition =
  "absolute size-4 transition-[rotate,scale,opacity] duration-300 ease-out-quint motion-reduce:transition-none";

/**
 * Theme switcher. The trigger icon is driven purely by the `.dark` class on
 * <html> (set by next-themes before paint), so it renders correctly on the
 * server and needs no "mounted" guard. Sun and moon cross-rotate on change.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "press relative flex size-10 items-center justify-center rounded-lg sm:size-9",
            "text-muted-foreground hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground",
            "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35",
            className,
          )}
          aria-label="テーマを切り替え"
        >
          <Sun
            aria-hidden="true"
            className={cn(
              iconTransition,
              "scale-100 rotate-0 opacity-100 dark:scale-50 dark:-rotate-90 dark:opacity-0",
            )}
          />
          <Moon
            aria-hidden="true"
            className={cn(
              iconTransition,
              "scale-50 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100",
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          テーマ
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme ?? "system"}
          onValueChange={setTheme}
        >
          {options.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value} className="gap-2">
              <Icon aria-hidden="true" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
