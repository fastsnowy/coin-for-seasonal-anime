"use client";

import { Button } from "@/components/ui/button";
import { Copy, Twitter } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

type ShareButtonsProps = {
  shareText: string;
};

export function ShareButtons({ shareText }: ShareButtonsProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URLをコピーしました");
    } catch (error) {
      toast.error("コピーに失敗しました");
    }
  };

  const twitterUrl = new URL("https://twitter.com/intent/tweet");
  twitterUrl.searchParams.set("text", shareText);
  twitterUrl.searchParams.set("url", url);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <Button
        variant="default"
        className="w-full sm:w-auto gap-2 bg-[#000000] hover:bg-[#000000]/90 text-white"
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
