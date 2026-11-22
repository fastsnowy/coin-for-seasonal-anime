import { Spinner } from "@/components/ui/spinner";

/**
 * Overlay shown while switching seasons. The pill fades in after a short
 * delay so that fast navigations don't flash.
 */
export function SeasonLoadingIndicator() {
  return (
    <output
      aria-live="polite"
      className="fixed inset-x-0 top-14 bottom-0 z-50 flex items-start justify-center bg-background/55 pt-[30vh] backdrop-blur-[3px] animate-fade-up [animation-delay:120ms] [animation-duration:300ms]"
    >
      <div className="flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 shadow-lg animate-scale-in [animation-delay:120ms]">
        <Spinner className="size-4 text-coin" />
        <span className="text-sm font-medium text-shimmer">
          シーズンを読み込み中
        </span>
      </div>
    </output>
  );
}
