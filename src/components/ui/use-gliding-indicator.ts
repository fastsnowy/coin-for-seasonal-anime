"use client";

import * as React from "react";

type GlidingIndicatorOptions = {
  /** `both` sizes/positions the indicator to the active item's box; `x` only tracks left + width (underline). */
  axis?: "both" | "x";
};

/**
 * Positions `indicatorRef` over the element inside `containerRef` that matches
 * `activeSelector`, following it as state/size changes. Styles are written
 * directly to the DOM (no re-render). Once the first measurement is applied,
 * `data-indicator="ready"` is set on the container so CSS can enable the
 * glide transition and hide fallback active styles.
 *
 * The container must be the indicator's offset parent (position: relative).
 */
export function useGlidingIndicator(
  containerRef: React.RefObject<HTMLElement | null>,
  indicatorRef: React.RefObject<HTMLElement | null>,
  activeSelector: string,
  { axis = "both" }: GlidingIndicatorOptions = {},
) {
  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;

    let frame = 0;

    const update = () => {
      const active = container.querySelector<HTMLElement>(activeSelector);
      if (!active) {
        indicator.style.width = "0px";
        return;
      }
      indicator.style.translate =
        axis === "x"
          ? `${active.offsetLeft}px 0`
          : `${active.offsetLeft}px ${active.offsetTop}px`;
      indicator.style.width = `${active.offsetWidth}px`;
      if (axis === "both") indicator.style.height = `${active.offsetHeight}px`;

      if (container.dataset.indicator !== "ready") {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          container.dataset.indicator = "ready";
        });
      }
    };

    update();

    const mutations = new MutationObserver(update);
    mutations.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-state", "aria-checked", "aria-selected"],
    });

    const resize = new ResizeObserver(update);
    resize.observe(container);
    for (const child of Array.from(container.children)) resize.observe(child);

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize.disconnect();
    };
  }, [containerRef, indicatorRef, activeSelector, axis]);
}
