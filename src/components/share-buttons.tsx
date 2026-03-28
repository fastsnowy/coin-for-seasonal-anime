"use client";

import { Button } from "@/components/ui/button";
import { Copy, Share, Twitter } from "lucide-react";
import { toast } from "sonner";
import { useSyncExternalStore } from "react";

type ShareButtonsProps = {
  shareText: string;
};

const subscribe = () => () => {};
const emptyString = () => "";

export function ShareButtons({ shareText }: ShareButtonsProps) {
  const url = useSyncExternalStore(subscribe, () => window.location.href, emptyString);
  const canShare = useSyncExternalStore(subscribe, () => typeof navigator.share === "function", () => false);

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        text: shareText,
        url,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("共有に失敗しました");
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URLをコピーしました");
    } catch {
      toast.error("コピーに失敗しました");
    }
  };

  const twitterUrl = new URL("https://twitter.com/intent/tweet");
  twitterUrl.searchParams.set("text", shareText);
  twitterUrl.searchParams.set("url", url);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      {canShare && (
        <Button
          variant="default"
          className="w-full sm:w-auto gap-2"
          onClick={handleNativeShare}
        >
          <Share className="w-4 h-4" />
          シェアする
        </Button>
      )}
      <Button
        variant={canShare ? "outline" : "default"}
        className={`w-full sm:w-auto gap-2 ${!canShare ? "bg-[#000000] hover:bg-[#000000]/90 text-white" : ""}`}
        asChild
      >
        <a
          href={twitterUrl.toString()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="w-4 h-4 fill-current" />
          Xでシェア
        </a>
      </Button>
      <Button
        variant="outline"
        className="w-full sm:w-auto gap-2"
        onClick={handleCopyUrl}
      >
        <Copy className="w-4 h-4" />
        URLをコピー
      </Button>
    </div>
  );
}
