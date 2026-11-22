"use client";

import { Button } from "@/components/ui/button";
import {
  SegmentedControl,
  type SegmentOption,
} from "@/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

export type MediaType = "all" | "TV" | "OVA" | "MOVIE" | "WEB" | "OTHER";
export type SortType = "coins" | "watchers" | "title";
type SortOrder = "asc" | "desc";

interface AnimeFilterProps {
  mediaType: MediaType;
  sortBy: SortType;
  sortOrder: SortOrder;
  onMediaTypeChange: (value: MediaType) => void;
  onSortChange: (value: SortType) => void;
  onSortOrderChange: (value: SortOrder) => void;
  activeFilterCount: number;
}

const mediaTypes: readonly SegmentOption<MediaType>[] = [
  { value: "all", label: "すべて" },
  { value: "TV", label: "TV" },
  { value: "OVA", label: "OVA" },
  { value: "MOVIE", label: "映画" },
  { value: "WEB", label: "WEB" },
  { value: "OTHER", label: "他" },
];

const sortOptions: readonly SegmentOption<SortType>[] = [
  { value: "coins", label: "コイン数" },
  { value: "watchers", label: "視聴者数" },
  { value: "title", label: "タイトル" },
];

const orderOptions: readonly SegmentOption<SortOrder>[] = [
  {
    value: "desc",
    label: "降順",
    icon: <ArrowDownWideNarrow aria-hidden="true" />,
  },
  {
    value: "asc",
    label: "昇順",
    icon: <ArrowUpNarrowWide aria-hidden="true" />,
  },
];

export function AnimeFilter({
  mediaType,
  sortBy,
  sortOrder,
  onMediaTypeChange,
  onSortChange,
  onSortOrderChange,
  activeFilterCount,
}: AnimeFilterProps) {
  const resetFilters = () => {
    onMediaTypeChange("all");
    onSortChange("coins");
    onSortOrderChange("desc");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Desktop */}
      <div className="hidden items-center gap-2 md:flex">
        <SegmentedControl
          aria-label="メディアで絞り込み"
          options={mediaTypes}
          value={mediaType}
          onValueChange={onMediaTypeChange}
          size="sm"
        />

        <span aria-hidden="true" className="h-5 w-px bg-border" />

        <Select
          value={sortBy}
          onValueChange={(v) => onSortChange(v as SortType)}
        >
          <SelectTrigger size="sm" className="w-28 text-xs" aria-label="並び順">
            <SelectValue placeholder="並び順" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onSortOrderChange(sortOrder === "desc" ? "asc" : "desc")}
          aria-label={
            sortOrder === "desc"
              ? "降順で表示中。昇順に切り替える"
              : "昇順で表示中。降順に切り替える"
          }
          title={sortOrder === "desc" ? "降順" : "昇順"}
        >
          {sortOrder === "desc" ? (
            <ArrowDownWideNarrow aria-hidden="true" />
          ) : (
            <ArrowUpNarrowWide aria-hidden="true" />
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            icon={<RotateCcw aria-hidden="true" />}
            className="animate-scale-in text-muted-foreground"
          >
            リセット
          </Button>
        )}
      </div>

      {/* Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="md"
            className="md:hidden"
            aria-label={
              activeFilterCount > 0
                ? `絞り込みと並び替え（${activeFilterCount}件変更中）`
                : "絞り込みと並び替え"
            }
          >
            <SlidersHorizontal aria-hidden="true" />
            絞り込み
            {activeFilterCount > 0 && (
              <span
                aria-hidden="true"
                className="flex size-5 animate-scale-in items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground tabular-nums"
              >
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="mx-auto w-full max-w-xl gap-0 rounded-t-2xl pb-safe sm:border-x">
          <div
            aria-hidden="true"
            className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-muted-foreground/20"
          />
          <SheetHeader className="pb-2">
            <SheetTitle>絞り込みと並び替え</SheetTitle>
            <SheetDescription>表示する作品と順番を選べます</SheetDescription>
          </SheetHeader>

          <div className="space-y-5 px-4 py-2">
            <fieldset className="space-y-2">
              <legend className="mb-2 text-xs font-medium text-muted-foreground">
                メディア
              </legend>
              <SegmentedControl
                aria-label="メディア"
                options={mediaTypes}
                value={mediaType}
                onValueChange={onMediaTypeChange}
                size="lg"
                fullWidth
                className="[&>button]:px-1"
              />
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="mb-2 text-xs font-medium text-muted-foreground">
                並び順
              </legend>
              <SegmentedControl
                aria-label="並び順"
                options={sortOptions}
                value={sortBy}
                onValueChange={onSortChange}
                size="lg"
                fullWidth
              />
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="mb-2 text-xs font-medium text-muted-foreground">
                順序
              </legend>
              <SegmentedControl
                aria-label="順序"
                options={orderOptions}
                value={sortOrder}
                onValueChange={onSortOrderChange}
                size="lg"
                fullWidth
              />
            </fieldset>
          </div>

          <SheetFooter className="flex-row gap-2 pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={resetFilters}
              disabled={activeFilterCount === 0}
              icon={<RotateCcw aria-hidden="true" />}
              className="flex-1"
            >
              リセット
            </Button>
            <SheetClose asChild>
              <Button variant="solid" size="lg" className="flex-1">
                完了
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
