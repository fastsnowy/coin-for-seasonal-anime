import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { siteName } from "@/config/constant";
import { getCurrentSeason, getNextSeason } from "@/lib/seasons";
import { getJSTDate } from "@/lib/date-utils";

import { ArrowRight, Coins, Github, Info, Share2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const current = getCurrentSeason();
  const next = getNextSeason();
  const currentYear = getJSTDate().getFullYear();

  return (
    <main className="relative min-h-dvh bg-background">
      <div className="absolute top-3 right-4 z-10 flex items-center gap-1">
        <UserMenu />
        <ThemeToggle />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--coin-muted)_0%,transparent_70%)]" />
        <div className="relative container mx-auto max-w-3xl px-4 py-28 md:py-40 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-coin-muted mb-6">
            <Coins className="h-8 w-8 text-coin" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">
            {siteName}
          </h1>
          <p className="text-xs text-muted-foreground mb-4 opacity-70">
            (旧 coin-for-seasonal-anime)
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
            気になるアニメに「コイン」を賭けて
            <br className="hidden sm:block" />
            期待度を表そう
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link href={`/seasons/${currentYear}-${current.id}`}>
              <Button
                size="lg"
                className="h-12 px-8 text-base gap-2 font-semibold active:scale-[0.97] transition-all"
              >
                今期（{current.name}）に賭ける
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/seasons/${next.year}-${next.id}`}>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base gap-2 font-semibold active:scale-[0.97] transition-all"
              >
                来期（{next.name}）に賭ける
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-center mb-10">使い方</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Coins,
                title: "コインを賭ける",
                desc: "気になるアニメにコインを賭けて期待度を表現。0〜100の範囲で自由に設定できます。",
              },
              {
                icon: Share2,
                title: "結果をシェア",
                desc: "投票後、あなたの期待度をSNSでシェアして友達と共有しましょう。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card p-6 space-y-3"
              >
                <div className="inline-flex p-2.5 rounded-lg bg-coin-muted">
                  <item.icon className="h-5 w-5 text-coin" />
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href={`/seasons/${currentYear}-${current.id}`}>
              <Button variant="outline" className="gap-2">
                さっそく投票する
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold mb-1">注意事項</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                このサイトはネタサイトです。「コイン」とは一般名称であり、実際の金融通貨等と一切関係ありません。
                投票結果はあくまで娯楽目的であり、作品の価値を決めるものではありません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              プライバシーポリシー
            </Link>
            <a
              href="https://github.com/fastsnowy/coin-for-seasonal-anime"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            &copy; {getJSTDate().getFullYear()} {siteName}
          </p>
        </div>
      </footer>
    </main>
  );
}
