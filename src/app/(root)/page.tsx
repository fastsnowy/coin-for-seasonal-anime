import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 grid container my-4">
      <h1 className="text-6xl">
        アニメに対する期待度を「コイン」を賭けて表そう！
      </h1>
      <Button asChild>
        <Link href="/seasons">シーズン一覧</Link>
      </Button>
      <Button asChild>
        <Link href="/results/1">投票結果</Link>
      </Button>
    </div>
  );
}
