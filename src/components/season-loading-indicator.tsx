export function SeasonLoadingIndicator() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-12 bottom-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm"
    >
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-coin/20 border-t-coin motion-reduce:animate-none"
        aria-hidden="true"
      />
      <p className="text-sm text-muted-foreground">シーズンを読み込んでいます</p>
    </div>
  );
}
