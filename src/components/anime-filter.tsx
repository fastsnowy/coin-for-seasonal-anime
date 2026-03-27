"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

export type MediaType = "all" | "TV" | "OVA" | "MOVIE" | "WEB" | "OTHER";
export type SortType = "coins" | "watchers" | "title";

interface AnimeFilterProps {
  mediaType: MediaType;
  sortBy: SortType;
  sortOrder: "asc" | "desc";
  onMediaTypeChange: (value: MediaType) => void;
  onSortChange: (value: SortType) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  activeFilterCount: number;
}

const mediaTypes = [
  { value: "all", label: "すべて" },
  { value: "TV", label: "TV" },
  { value: "OVA", label: "OVA" },
  { value: "MOVIE", label: "映画" },
  { value: "WEB", label: "WEB" },
  { value: "OTHER", label: "他" },
];

const sortOptions = [
  { value: "coins", label: "コイン数" },
  { value: "watchers", label: "視聴者数" },
  { value: "title", label: "タイトル" },
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
    <div className="flex items-center gap-1.5">
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-1.5">
        <Select value={mediaType} onValueChange={onMediaTypeChange}>
          <SelectTrigger className="w-28 h-8 text-xs">
            <SelectValue placeholder="メディア" />
          </SelectTrigger>
          <SelectContent>
            {mediaTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-28 h-8 text-xs">
            <SelectValue placeholder="並び順" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={() => onSortOrderChange(sortOrder === "desc" ? "asc" : "desc")}
          className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {sortOrder === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUp className="h-3.5 w-3.5" />
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="md:hidden h-8 px-3 rounded-lg border border-border text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            フィルター
            {activeFilterCount > 0 && (
              <Badge
                variant="default"
                className="ml-0.5 h-4 min-w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
              >
                {activeFilterCount}
              </Badge>
            )}
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader className="text-center">
            <div className="mx-auto w-10 h-1 bg-muted-foreground/20 rounded-full mb-3" />
            <SheetTitle>フィルター</SheetTitle>
            <SheetDescription>表示条件を変更</SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-5 px-1">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">メディア</p>
              <div className="grid grid-cols-3 gap-1.5">
                {mediaTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => onMediaTypeChange(t.value as MediaType)}
                    className={cn(
                      "h-9 rounded-lg text-sm font-medium transition-colors",
                      mediaType === t.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">並び順</p>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">順序</p>
              <div className="grid grid-cols-2 gap-1.5">
                {(["desc", "asc"] as const).map((order) => (
                  <button
                    key={order}
                    type="button"
                    onClick={() => onSortOrderChange(order)}
                    className={cn(
                      "h-9 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors",
                      sortOrder === order
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {order === "desc" ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}
                    {order === "desc" ? "降順" : "昇順"}
                  </button>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <Button variant="outline" onClick={resetFilters} className="w-full">
                リセット
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
