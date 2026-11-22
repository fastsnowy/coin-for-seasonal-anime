import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { getCurrentSeason } from "@/lib/seasons";
import { getJSTDate } from "@/lib/date-utils";
import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const current = getCurrentSeason();
  const currentYear = getJSTDate().getFullYear();

  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />
      <div className="stagger-children mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
        <div className="relative">
          <p
            aria-hidden="true"
            className="bg-[linear-gradient(to_bottom,var(--foreground),transparent)] bg-clip-text text-8xl leading-none font-extrabold tracking-tighter text-transparent opacity-15 select-none sm:text-9xl"
          >
            404
          </p>
          <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-2xl border border-border bg-card shadow-md">
            <Compass className="size-5 text-coin-foreground" aria-hidden="true" />
          </span>
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight">
            ページが見つかりません
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            URLが間違っているか、ページが移動・削除された可能性があります。
          </p>
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
          <Button asChild variant="solid" size="md">
            <Link href="/">
              <ArrowLeft aria-hidden="true" />
              ホームへ戻る
            </Link>
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href={`/seasons/${currentYear}-${current.id}`}>
              今期（{current.name}）のアニメを見る
            </Link>
          </Button>
        </div>
        <Link
          href="/my-votes"
          className="rounded-md px-2 py-2 text-xs text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/35"
        >
          投票履歴を確認する
        </Link>
      </div>
    </main>
  );
}
