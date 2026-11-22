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

/** Small gold coin glyph used as the wordmark's logo. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex size-6 shrink-0 items-center justify-center rounded-full",
        "bg-[radial-gradient(circle_at_30%_25%,oklch(0.93_0.11_92),var(--coin)_55%,oklch(0.58_0.14_75))]",
        "shadow-[inset_0_0_0_1px_oklch(0.45_0.1_75/35%),var(--elevation-xs)]",
        className,
      )}
    >
      <span className="size-[55%] rounded-full border border-[oklch(0.45_0.1_75/40%)]" />
    </span>
  );
}

export function SiteHeader({
  className,
  maxWidth = "max-w-5xl",
  children,
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/65",
        className,
      )}
    >
      <div
        className={cn(
          "container mx-auto flex h-14 items-center justify-between gap-3 px-4",
          maxWidth,
        )}
      >
        <Link
          href="/"
          aria-label={`${siteName} ホーム`}
          className="group -mx-1.5 flex shrink-0 items-center gap-2 rounded-lg px-1.5 py-1.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35"
        >
          <BrandMark className="transition-[rotate] duration-500 ease-spring group-hover:rotate-[20deg] motion-reduce:transition-none" />
          {/* With inline nav (children) the wordmark collapses to the coin on phones. */}
          <span
            className={cn(
              "text-[15px] font-bold tracking-tight",
              children && "hidden sm:inline",
            )}
          >
            {siteName}
          </span>
        </Link>

        {children}

        <div className="flex shrink-0 items-center gap-0.5">
          <UserMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
