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
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">🥇{siteName}</h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            気になるアニメに「コイン」を賭けて期待度を表そう！
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href={`/seasons/${currentYear}-${current.id}`}>
              <Button size="lg" className="gap-2">
                今期アニメを見る <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 装飾的な背景要素 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary" />
          <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-primary" />
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-primary" />
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">使い方</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Coins className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">コインを賭ける</h3>
                  <p className="text-muted-foreground">
                    気になるアニメにコインを賭けて、あなたの期待度を表現しましょう。
                    0~100までの範囲で自由に設定できます。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Share2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">結果をシェア</h3>
                  <p className="text-muted-foreground">
                    投票後、あなたの期待度をSNSでシェアして友達と共有しましょう。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link href={`/seasons/${currentYear}-${current.id}`}>
              <Button size="lg">さっそく投票する</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 注意事項セクション */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-muted/50 border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">注意事項</h3>
                <p className="text-muted-foreground text-sm">
                  このサイトはネタサイトです。ここで言う「コイン」とは一般名称であり、実際の金融通貨等と一切関係ありません。
                  投票結果はあくまで娯楽目的であり、作品の価値を決めるものではありません。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto max-w-4xl text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {siteName} - All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
