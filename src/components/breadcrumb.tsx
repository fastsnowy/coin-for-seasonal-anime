"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="パンくずリスト" className="mb-3">
      <ol className="flex items-center gap-1 text-xs text-muted-foreground">
        <li>
          <Link
            href="/"
            aria-label="ホーム"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Home className="h-3 w-3" aria-hidden="true" />
            <span className="hidden sm:inline">ホーム</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 shrink-0" />
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
