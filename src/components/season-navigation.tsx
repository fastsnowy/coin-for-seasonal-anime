"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getJSTDate } from "@/lib/date-utils";
import {
  atomBetAnimeWorkId,
  atomBetCoinValue,
  atomResetBetCoins,
  atomSelectSeason,
  atomSelectYear,
} from "@/global/atom";
import { getCurrentSeason, type Season } from "@/lib/seasons";
import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { SeasonLoadingIndicator } from "./season-loading-indicator";

const seasons = [
  { id: "winter", name: "冬" },
  { id: "spring", name: "春" },
  { id: "summer", name: "夏" },
  { id: "autumn", name: "秋" },
];

const SEASON_ID_PATTERN = /^(\d{4})-(spring|summer|autumn|winter)$/;

export default function SeasonNavigation() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const thisYear = getJSTDate().getFullYear();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const setSelectedYearAtom = useSetAtom(atomSelectYear);
  const setSelectedSeasonAtom = useSetAtom(atomSelectSeason);
  const resetBetAnimeWorkId = useResetAtom(atomBetAnimeWorkId);
  const resetAllBetCoins = useSetAtom(atomResetBetCoins);
  const draftVotes = useAtomValue(atomBetCoinValue);

  const routeId = params?.id ?? null;
  const routeMatch = routeId?.match(SEASON_ID_PATTERN) ?? null;
  const routeYear = routeMatch?.[1] ?? null;
  const routeSeason = (routeMatch?.[2] as Season | undefined) ?? null;

  const [selectedYear, setSelectedYear] = useState(
    routeYear ?? thisYear.toString(),
  );
  const [selectedSeason, setSelectedSeason] = useState<Season>(
    routeSeason ?? getCurrentSeason().id,
  );
  const [syncedRouteId, setSyncedRouteId] = useState(routeId);

  if (routeId !== syncedRouteId) {
    setSyncedRouteId(routeId);
    if (routeYear && routeSeason) {
      setSelectedYear(routeYear);
      setSelectedSeason(routeSeason);
    }
  }

  useEffect(() => {
    if (!routeYear || !routeSeason) return;
    setSelectedYearAtom(routeYear);
    setSelectedSeasonAtom(routeSeason);
    resetAllBetCoins();
    resetBetAnimeWorkId();
  }, [
    routeYear,
    routeSeason,
    setSelectedYearAtom,
    setSelectedSeasonAtom,
    resetAllBetCoins,
    resetBetAnimeWorkId,
  ]);

  const years = Array.from(
    { length: thisYear - 1999 },
    (_, i) => thisYear + 1 - i,
  );

  const targetId = `${selectedYear}-${selectedSeason}`;

  const navigateToSeason = () => {
    startTransition(() => {
      router.push(`/seasons/${targetId}`);
    });
  };

  const handleNavigate = () => {
    if (routeId === targetId || isPending) return;
    if (draftVotes.length > 0) {
      setConfirmOpen(true);
      return;
    }
    navigateToSeason();
  };

  const handleConfirmNavigate = () => {
    setConfirmOpen(false);
    navigateToSeason();
  };

  return (
    <fieldset
      aria-label="シーズンを選択"
      className="m-0 flex min-w-0 shrink-0 items-center gap-1.5 border-0 p-0"
    >
      <Select
        value={selectedYear}
        onValueChange={setSelectedYear}
        disabled={isPending}
      >
        <SelectTrigger
          className="w-[5.5rem] text-xs data-[size=default]:h-10 sm:data-[size=default]:h-8"
          aria-label="年"
        >
          <SelectValue placeholder="年" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}年
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedSeason}
        onValueChange={(v) => setSelectedSeason(v as Season)}
        disabled={isPending}
      >
        <SelectTrigger
          className="w-16 text-xs data-[size=default]:h-10 sm:data-[size=default]:h-8"
          aria-label="季節"
        >
          <SelectValue placeholder="季" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="solid"
        size="md"
        className="px-3.5 text-xs sm:h-8 sm:px-3"
        onClick={handleNavigate}
        disabled={!isPending && routeId === targetId}
        loading={isPending}
        aria-label={
          routeId === targetId
            ? "表示中のシーズン"
            : `${selectedYear}年 ${seasons.find((s) => s.id === selectedSeason)?.name ?? ""}を表示`
        }
      >
        表示
      </Button>

      {isPending && createPortal(<SeasonLoadingIndicator />, document.body)}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>投票内容を破棄しますか？</DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed">
              別のシーズンを表示すると、まだ確定していない投票内容は破棄されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setConfirmOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="md"
              onClick={handleConfirmNavigate}
            >
              破棄して表示
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </fieldset>
  );
}
