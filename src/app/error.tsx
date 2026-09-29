"use client";

import { Button } from "@/components/ui/button";
import { siteName } from "@/config/constant";
import { CircleAlert } from "lucide-react";
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
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-12 max-w-4xl items-center px-4">
          <Link
            href="/"
            className="truncate text-sm font-bold transition-colors hover:text-foreground/80"
          >
            {siteName}
          </Link>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-24">
        <CircleAlert
          className="h-12 w-12 text-muted-foreground/50"
          aria-hidden="true"
        />
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-bold">問題が発生しました</h1>
          <p className="text-sm text-muted-foreground" role="alert">
            ページの表示に失敗しました。再試行するか、トップページへ戻ってください。
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={reset}>
            再試行
          </Button>
          <Button asChild variant="outline">
            <Link href="/">ホームへ戻る</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/my-votes">投票履歴</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
