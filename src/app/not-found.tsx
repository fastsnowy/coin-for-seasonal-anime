import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-4xl" />
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-24">
        <FileQuestion
          className="h-12 w-12 text-muted-foreground/50"
          aria-hidden="true"
        />
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-bold">ページが見つかりません</h1>
          <p className="text-sm text-muted-foreground">
            URLをご確認いただくか、トップページから目的のページへお進みください。
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">ホームへ戻る</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/my-votes">投票履歴</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
