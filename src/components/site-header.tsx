import Link from "next/link";
import { siteName } from "@/config/constant";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  className?: string;
  maxWidth?: string;
  children?: React.ReactNode;
}

export function SiteHeader({
  className,
  maxWidth = "max-w-5xl",
  children,
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl",
        className,
      )}
    >
      <div
        className={cn(
          "container mx-auto px-4 h-12 flex items-center justify-between gap-3",
          maxWidth,
        )}
      >
        <Link
          href="/"
          className="text-sm font-bold truncate hover:text-foreground/80 transition-colors shrink-0"
        >
          {siteName}
        </Link>

        {children}

        <div className="flex items-center gap-1">
          <UserMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
