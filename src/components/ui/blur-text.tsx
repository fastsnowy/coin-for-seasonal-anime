import type * as React from "react";

import { cn } from "@/lib/utils";

type BlurTextProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  text: string;
  /**
   * `word` splits with Intl.Segmenter (works for Japanese) and falls back to
   * whitespace; `char` animates each grapheme.
   */
  by?: "word" | "char";
  /** Element to render. Defaults to `span`. */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
  /** Delay before the first segment, in ms. */
  delay?: number;
  /** Delay between segments, in ms. Defaults to 40 (word) / 18 (char). */
  stagger?: number;
};

function split(text: string, by: "word" | "char"): string[] {
  if (by === "char") return Array.from(text);
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return text.split(/(\s+)/);
}

/**
 * Text that rises out of a blur, segment by segment (CSS only, so it works in
 * server components and replays on mount). Under reduced motion the text is
 * shown immediately. The full string is exposed once to assistive tech.
 */
function BlurText({
  text,
  by = "word",
  as: Tag = "span",
  delay = 0,
  stagger,
  className,
  ...props
}: BlurTextProps) {
  const step = stagger ?? (by === "char" ? 18 : 40);
  const segments = split(text, by);

  return (
    <Tag data-slot="blur-text" className={className} {...props}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {segments.map((segment, i) =>
          /^\s+$/.test(segment) ? (
            segment
          ) : (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: static split of a string
              key={i}
              className={cn("inline-block animate-blur-rise whitespace-pre")}
              style={{ animationDelay: `${delay + i * step}ms` }}
            >
              {segment}
            </span>
          ),
        )}
      </span>
    </Tag>
  );
}

export { BlurText };
export type { BlurTextProps };
