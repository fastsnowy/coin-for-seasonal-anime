import { Button } from "@/components/ui/button";
import { BlurText } from "@/components/ui/blur-text";
import { SiteHeader } from "@/components/site-header";
import { siteName } from "@/config/constant";
import { getCurrentSeason, getNextSeason } from "@/lib/seasons";
import { getJSTDate } from "@/lib/date-utils";

import {
  ArrowRight,
  Coins,
  Github,
  Info,
  MousePointerClick,
  Share2,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: MousePointerClick,
    title: "作品を選ぶ",
    desc: "今期・来期のアニメ一覧から、気になる作品を見つけましょう。",
  },
  {
    icon: Coins,
    title: "コインを賭ける",
    desc: "作品ごとに0〜100枚の範囲でコインを賭けて、期待度を表現します。",
  },
  {
    icon: Share2,
    title: "結果をシェア",
    desc: "投票後は、あなたの期待度をSNSでシェアして友達と共有できます。",
  },
] as const;

export default function Home() {
  const current = getCurrentSeason();
  const next = getNextSeason();
  const currentYear = getJSTDate().getFullYear();
  const currentHref = `/seasons/${currentYear}-${current.id}`;

  return (
    <main className="relative min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-5xl" />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {/* Decorative backdrop: faint grid fading out + soft coin glow. Static, so reduced-motion safe. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_30%,transparent_75%)]" />
          <div className="absolute top-[-12rem] left-1/2 h-[28rem] w-[min(56rem,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--coin-muted),transparent)] blur-2xl" />
        </div>

        <div className="container mx-auto flex max-w-3xl flex-col items-center px-4 pt-20 pb-24 text-center sm:pt-28 md:pt-36 md:pb-32">
          <p className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 py-1 pr-3 pl-1 text-xs text-muted-foreground shadow-xs backdrop-blur">
            <span className="rounded-full bg-coin-muted px-2 py-0.5 font-semibold text-coin-foreground">
              {siteName}
            </span>
            旧 coin-for-seasonal-anime
          </p>

          <h1 className="max-w-[18ch] text-[2.5rem] leading-[1.15] font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <BlurText text="気になるアニメに、" delay={80} />
            <br />
            <BlurText
              text="コインを賭けよう。"
              delay={320}
              className="text-coin-foreground"
            />
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-md text-base leading-relaxed text-pretty text-muted-foreground md:text-lg"
            style={{ animationDelay: "500ms" }}
          >
            作品ごとに「コイン」を賭けて、あなたの期待度をかたちに。
            みんなの期待度ランキングもチェックできます。
          </p>

          <div
            className="animate-fade-up mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
            style={{ animationDelay: "620ms" }}
          >
            <Button asChild variant="solid" size="lg" className="group">
              <Link href={currentHref}>
                今期（{current.name}）に賭ける
                <ArrowRight
                  aria-hidden="true"
                  className="transition-[translate] duration-200 ease-out-quint group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/seasons/${next.year}-${next.id}`}>
                来期（{next.name}）に賭ける
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        aria-labelledby="how-heading"
        className="border-t border-border bg-surface-sunken/60 px-4 py-16 md:py-20"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-coin-foreground">
              HOW IT WORKS
            </p>
            <h2 id="how-heading" className="text-2xl font-bold tracking-tight">
              使い方
            </h2>
          </div>
          <ol className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {steps.map((item, i) => (
              <li
                key={item.title}
                className="surface relative flex flex-col gap-3 rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-coin-muted text-coin-foreground">
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-xs font-semibold text-muted-foreground/60 tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-semibold">
                  <span className="sr-only">ステップ{i + 1}: </span>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Button asChild variant="soft" size="md">
              <Link href={currentHref}>
                さっそく投票する
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section aria-labelledby="notice-heading" className="border-t border-border px-4 py-10">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <Info
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <h2 id="notice-heading" className="mb-1 text-sm font-semibold">
                注意事項
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground">
                このサイトはネタサイトです。「コイン」とは一般名称であり、実際の金融通貨等と一切関係ありません。
                投票結果はあくまで娯楽目的であり、作品の価値を決めるものではありません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="container mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} {siteName}
          </p>
          <div className="flex items-center gap-1">
            <Link
              href="/privacy"
              className="flex min-h-10 items-center rounded-md px-2 text-xs text-muted-foreground underline-offset-4 outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/35"
            >
              プライバシーポリシー
            </Link>
            <a
              href="https://github.com/fastsnowy/coin-for-seasonal-anime"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35"
            >
              <Github className="size-4" aria-hidden="true" />
              <span className="sr-only">GitHub（新しいタブで開きます）</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
