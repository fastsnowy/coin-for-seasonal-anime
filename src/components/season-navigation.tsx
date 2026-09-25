"use client";

import { getJSTDate } from "@/lib/date-utils";


import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  atomBetAnimeWorkId,
  atomResetBetCoins,
  atomSelectSeason,
  atomSelectYear,
} from "@/global/atom";
import { getCurrentSeason, type Season } from "@/lib/seasons";
import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  const setSelectedYearAtom = useSetAtom(atomSelectYear);
  const setSelectedSeasonAtom = useSetAtom(atomSelectSeason);
  const resetBetAnimeWorkId = useResetAtom(atomBetAnimeWorkId);
  const resetAllBetCoins = useSetAtom(atomResetBetCoins);

  const routeId = params?.id ?? null;
  const routeMatch = routeId?.match(SEASON_ID_PATTERN) ?? null;
  const routeYear = routeMatch?.[1] ?? null;
  const routeSeason = (routeMatch?.[2] as Season | undefined) ?? null;

  // 表示中の年/季節をセレクトの初期値とし、ページ遷移時は追従させる
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

  // 投票対象のシーズンは必ずURLと一致させる
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

  const handleNavigate = () => {
    router.push(`/seasons/${selectedYear}-${selectedSeason}`);
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <Select value={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="w-20 h-8 text-xs">
          <SelectValue placeholder="年" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>{y}年</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedSeason}
        onValueChange={(v) => setSelectedSeason(v as Season)}
      >
        <SelectTrigger className="w-16 h-8 text-xs">
          <SelectValue placeholder="季" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((s) => (
            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        size="sm"
        className="h-8 px-3 text-xs"
        onClick={handleNavigate}
      >
        表示
      </Button>
    </div>
  );
}
