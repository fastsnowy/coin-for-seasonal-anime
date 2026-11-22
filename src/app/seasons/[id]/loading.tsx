import { Skeleton } from "@/components/ui/skeleton";

const CARD_SKELETON_IDS = [
  "season-card-1",
  "season-card-2",
  "season-card-3",
  "season-card-4",
  "season-card-5",
  "season-card-6",
];

const RANK_SKELETON_IDS = ["rank-1", "rank-2", "rank-3"];

function AnimeCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <Skeleton className="aspect-video rounded-none" />
      <div className="flex flex-col gap-2 px-3.5 pt-3 pb-2.5">
        <div className="min-h-[2.75em] space-y-1.5">
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex h-8 items-center gap-2">
          <Skeleton className="h-5 w-9 rounded-md" />
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="ml-auto h-3 w-12" />
        </div>
      </div>
      <div className="border-t border-border/70 bg-surface-sunken/40 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex flex-1 flex-col items-center gap-1.5">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-1 w-full max-w-28 rounded-full" />
          </div>
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function SeasonLoading() {
  return (
    <div
      aria-busy="true"
      className="container mx-auto max-w-5xl px-4 pt-4 pb-8"
    >
      <output aria-live="polite" className="sr-only">
        シーズンのアニメを読み込み中
      </output>

      {/* Breadcrumb */}
      <Skeleton className="mb-3 h-3 w-32" />

      {/* Section heading */}
      <div className="mb-5 flex justify-center">
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Ranking */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <div className="surface divide-y divide-border overflow-hidden rounded-2xl">
          {RANK_SKELETON_IDS.map((id) => (
            <div
              key={id}
              className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5"
            >
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <Skeleton className="hidden h-9 w-16 shrink-0 sm:block" />
              <div className="min-w-0 flex-1 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-1.5 flex-1 rounded-full" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between gap-3 py-2.5">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="hidden h-8 w-64 rounded-lg md:block" />
          <Skeleton className="hidden h-8 w-28 rounded-lg md:block" />
          <Skeleton className="hidden size-8 rounded-md md:block" />
          <Skeleton className="h-10 w-28 rounded-lg md:hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-28 sm:grid-cols-2 lg:grid-cols-3">
        {CARD_SKELETON_IDS.map((id) => (
          <AnimeCardSkeleton key={id} />
        ))}
      </div>
    </div>
  );
}
