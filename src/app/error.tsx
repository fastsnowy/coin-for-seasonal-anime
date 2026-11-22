"use client";

import { Button } from "@/components/ui/button";
import { siteName } from "@/config/constant";
import { CircleAlert, RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-dvh bg-background">
      {/* Minimal header: the full SiteHeader is a server component. */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/65">
        <div className="container mx-auto flex h-14 max-w-4xl items-center px-4">
          <Link
            href="/"
            className="-mx-1.5 flex items-center gap-2 rounded-lg px-1.5 py-1.5 text-[15px] font-bold tracking-tight outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35"
          >
            <span
              aria-hidden="true"
              className="size-6 rounded-full bg-[radial-gradient(circle_at_30%_25%,oklch(0.93_0.11_92),var(--coin)_55%,oklch(0.58_0.14_75))] shadow-[inset_0_0_0_1px_oklch(0.45_0.1_75/35%)]"
            />
            {siteName}
          </Link>
        </div>
      </header>
      <div className="stagger-children mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-destructive/15 bg-destructive-muted">
          <CircleAlert className="size-6 text-destructive" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight">
            問題が発生しました
          </h1>
          <p
            role="alert"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            ページの表示に失敗しました。少し時間をおいて再試行するか、トップページへ戻ってください。
          </p>
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
          <Button
            type="button"
            variant="solid"
            size="md"
            onClick={reset}
            icon={<RotateCw aria-hidden="true" />}
          >
            再試行
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href="/">ホームへ戻る</Link>
          </Button>
        </div>
        <Link
          href="/my-votes"
          className="rounded-md px-2 py-2 text-xs text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/35"
        >
          投票履歴を確認する
        </Link>
        {error.digest ? (
          <p className="font-mono text-[11px] text-muted-foreground/70">
            エラーID: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}
