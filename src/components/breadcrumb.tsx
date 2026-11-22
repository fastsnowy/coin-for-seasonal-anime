import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const linkClass =
  "-mx-1 flex min-h-8 items-center gap-1 rounded-md px-1 text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35";

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="パンくずリスト" className="mb-3">
      <ol className="flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs">
        <li className="flex items-center">
          <Link href="/" className={linkClass}>
            <Home className="size-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">ホーム</span>
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight
                className="size-3 shrink-0 text-muted-foreground/50"
                aria-hidden="true"
              />
              {item.href && !isLast ? (
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="truncate font-medium text-foreground"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
