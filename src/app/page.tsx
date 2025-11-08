import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteName } from "@/config/constant";
import { getCurrentSeason } from "@/lib/seasons";
import { ArrowRight, Coins, Info, Share2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // 現在の季節を取得
  const current = getCurrentSeason();
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/5 py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
            <Coins className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {siteName}
          </h1>
          <p className="text-lg md:text-xl mb-10 text-muted-foreground max-w-2xl mx-auto">
            気になるアニメに「コイン」を賭けて期待度を表そう！
          </p>
          <Link href={`/seasons/${currentYear}-${current.id}`}>
            <Button
              size="lg"
              className="gap-2 text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              今期アニメを見る <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            使い方
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-5 rounded-2xl mb-5">
                    <Coins className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">コインを賭ける</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    気になるアニメにコインを賭けて、あなたの期待度を表現しましょう。
                    0〜100までの範囲で自由に設定できます。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-5 rounded-2xl mb-5">
                    <Share2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">結果をシェア</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    投票後、あなたの期待度をSNSでシェアして友達と共有しましょう。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href={`/seasons/${currentYear}-${current.id}`}>
              <Button size="lg" variant="outline" className="gap-2">
                さっそく投票する
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 注意事項セクション */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-background/80 backdrop-blur border border-border/50 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="bg-muted p-2 rounded-lg flex-shrink-0">
                <Info className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">注意事項</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  このサイトはネタサイトです。ここで言う「コイン」とは一般名称であり、実際の金融通貨等と一切関係ありません。
                  投票結果はあくまで娯楽目的であり、作品の価値を決めるものではありません。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-4xl text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {siteName}
          </p>
        </div>
      </footer>
    </main>
  );
}
