"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, Share } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type ShareButtonsProps = {
  shareText: string;
};

const subscribe = () => () => {};
const emptyString = () => "";

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ShareButtons({ shareText }: ShareButtonsProps) {
  const url = useSyncExternalStore(
    subscribe,
    () => window.location.href,
    emptyString,
  );
  const canShare = useSyncExternalStore(
    subscribe,
    () => typeof navigator.share === "function",
    () => false,
  );
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

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
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("コピーに失敗しました");
    }
  };

  const twitterUrl = new URL("https://twitter.com/intent/tweet");
  twitterUrl.searchParams.set("text", shareText);
  twitterUrl.searchParams.set("url", url);

  return (
    <div className="grid w-full grid-cols-1 gap-2.5 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-center">
      {canShare && (
        <Button
          variant="solid"
          size="md"
          onClick={handleNativeShare}
          icon={<Share aria-hidden="true" />}
        >
          シェアする
        </Button>
      )}
      <Button variant={canShare ? "outline" : "solid"} size="md" asChild>
        <a href={twitterUrl.toString()} target="_blank" rel="noopener noreferrer">
          <XLogo />
          Xでポスト
          <span className="sr-only">（新しいタブで開きます）</span>
        </a>
      </Button>
      <Button
        variant="outline"
        size="md"
        onClick={handleCopyUrl}
        icon={
          <span className="relative size-4" aria-hidden="true">
            <Copy
              className={`absolute inset-0 transition-[scale,opacity] duration-200 ease-out-quint motion-reduce:transition-none ${copied ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}
            />
            <Check
              className={`absolute inset-0 text-success transition-[scale,opacity] duration-200 ease-out-quint motion-reduce:transition-none ${copied ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
            />
          </span>
        }
      >
        URLをコピー
      </Button>
    </div>
  );
}
