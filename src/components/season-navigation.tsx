"use client";

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
import type { Season } from "@/lib/seasons";
import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const seasons = [
  { id: "winter", name: "冬" },
  { id: "spring", name: "春" },
  { id: "summer", name: "夏" },
  { id: "autumn", name: "秋" },
];

export default function SeasonNavigation() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const thisYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useAtom(atomSelectYear);
  const [selectedSeason, setSelectedSeason] = useAtom(atomSelectSeason);
  const resetBetAnimeWorkId = useResetAtom(atomBetAnimeWorkId);
  const resetAllBetCoins = useSetAtom(atomResetBetCoins);

  useEffect(() => {
    if (params?.id) {
      const match = params.id.match(/^(\d{4})-(spring|summer|autumn|winter)$/);
      if (match) {
        setSelectedYear(match[1]);
        setSelectedSeason(match[2] as Season);
        resetAllBetCoins();
        resetBetAnimeWorkId();
      }
    }
  }, [params?.id, setSelectedYear, setSelectedSeason, resetAllBetCoins, resetBetAnimeWorkId]);

  const years = Array.from(
    { length: thisYear - 1999 },
    (_, i) => thisYear + 1 - i,
  );

  const handleNavigate = () => {
    resetAllBetCoins();
    resetBetAnimeWorkId();
    router.push(`/seasons/${selectedYear}-${selectedSeason}`);
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
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
        defaultValue={selectedSeason}
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
