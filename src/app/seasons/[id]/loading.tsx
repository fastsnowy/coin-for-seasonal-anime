import { SeasonLoadingIndicator } from "@/components/season-loading-indicator";
import { Skeleton } from "@/components/ui/skeleton";

const CARD_SKELETON_IDS = [
  "season-card-1",
  "season-card-2",
  "season-card-3",
  "season-card-4",
  "season-card-5",
  "season-card-6",
];

function AnimeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="aspect-video rounded-none" />
      <div className="space-y-2 p-3">
        <div className="min-h-[2.5em] space-y-1.5">
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4.5 w-10 rounded-full" />
          <Skeleton className="ml-auto h-3 w-10" />
        </div>
      </div>
      <div className="border-t border-border/50 px-3 pt-1 pb-3">
        <div className="flex items-center justify-between gap-2 py-0.5">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function SeasonLoading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 pt-4 pb-8">
      <SeasonLoadingIndicator />
      <Skeleton className="mb-3 h-3 w-40" />

      <div className="mb-5 flex justify-center">
        <Skeleton className="h-5 w-28" />
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-14" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="hidden h-8 w-28 md:block" />
          <Skeleton className="hidden h-8 w-28 md:block" />
          <Skeleton className="hidden h-8 w-8 md:block" />
          <Skeleton className="h-8 w-24 md:hidden" />
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
