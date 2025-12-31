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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDown,
  ArrowUp,
  Filter,
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

export function AnimeFilter({
  mediaType,
  sortBy,
  sortOrder,
  onMediaTypeChange,
  onSortChange,
  onSortOrderChange,
  activeFilterCount,
}: AnimeFilterProps) {
  const mediaTypes = [
    { value: "all", label: "すべて" },
    { value: "TV", label: "TV" },
    { value: "OVA", label: "OVA" },
    { value: "MOVIE", label: "映画" },
    { value: "WEB", label: "WEB" },
    { value: "OTHER", label: "その他" },
  ];

  const sortOptions = [
    { value: "coins", label: "コイン数順" },
    { value: "watchers", label: "視聴者数順" },
    { value: "title", label: "タイトル順" },
  ];

  const resetFilters = () => {
    onMediaTypeChange("all");
    onSortChange("coins");
    onSortOrderChange("desc");
  };

  return (
    <div className="flex items-center gap-2">
      {/* デスクトップ表示 */}
      <div className="hidden md:flex items-center gap-2">
        <Select value={mediaType} onValueChange={onMediaTypeChange}>
          <SelectTrigger className="w-32 h-9 text-sm">
            <Filter className="h-3.5 w-3.5 mr-1" />
            <SelectValue placeholder="メディア" />
          </SelectTrigger>
          <SelectContent>
            {mediaTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
            <SelectValue placeholder="並び順" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onSortOrderChange(sortOrder === "desc" ? "asc" : "desc")
                }
                className="h-9 w-9"
              >
                {sortOrder === "desc" ? (
                  <ArrowDown className="h-4 w-4" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {sortOrder === "desc" ? "降順" : "昇順"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{sortOrder === "desc" ? "降順" : "昇順"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetFilters}
                className="h-9 w-9"
                disabled={activeFilterCount === 0}
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">リセット</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>リセット</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* モバイル表示 */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden relative h-9"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            フィルター
            {activeFilterCount > 0 && (
              <Badge
                variant="default"
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[400px]">
          <SheetHeader>
            <SheetTitle>フィルター</SheetTitle>
            <SheetDescription>アニメの表示条件を設定できます</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <div className="text-sm font-medium mb-2">メディアタイプ</div>
              <div className="grid grid-cols-3 gap-2">
                {mediaTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={mediaType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onMediaTypeChange(type.value as MediaType)}
                    className="w-full"
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">並び順</div>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="並び順を選択" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">表示順</div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={sortOrder === "desc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortOrderChange("desc")}
                  className="w-full gap-2"
                >
                  <ArrowDown className="h-4 w-4" />
                  降順
                </Button>
                <Button
                  variant={sortOrder === "asc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortOrderChange("asc")}
                  className="w-full gap-2"
                >
                  <ArrowUp className="h-4 w-4" />
                  昇順
                </Button>
              </div>
            </div>

            {activeFilterCount > 0 ? (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full"
              >
                フィルターをリセット
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                フィルターをリセット
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
