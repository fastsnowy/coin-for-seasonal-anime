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
      src={failed ? PLACEHOLDER_IMAGE : src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        if (src !== PLACEHOLDER_IMAGE) setFailedSrc(src);
      }}
    />
  );
}
