"use client";

import { PLACEHOLDER_IMAGE } from "@/lib/annict-works";
import { type ImgHTMLAttributes, useState } from "react";

type ThumbnailProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "onError"> & {
  src: string;
  alt: string;
};

/** 画像の読み込みに失敗したらプレースホルダへ切り替える (1回のみ。ループしない) */
export function Thumbnail({ src, alt, ...props }: ThumbnailProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const failed = failedSrc === src;
  return (
    <img
      {...props}
      ref={(img) => {
        // ハイドレーション前に失敗した画像は onError が発火しないため、ここで検出する
        if (img?.complete && img.naturalWidth === 0 && src !== PLACEHOLDER_IMAGE) setFailedSrc(src);
      }}
      src={failed ? PLACEHOLDER_IMAGE : src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        if (src !== PLACEHOLDER_IMAGE) setFailedSrc(src);
      }}
    />
  );
}
