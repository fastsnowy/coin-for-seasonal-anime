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
import { useRouter } from "next/navigation";

interface SeasonNavigationProps {
  currentYear: number;
  currentSeason: Season;
}

export default function SeasonNavigation() {
  const router = useRouter();
  const now = new Date();
  const thisYear = now.getFullYear();

  const [selectedYear, setSelectedYear] = useAtom(atomSelectYear);

  const [selectedSeason, setSelectedSeason] = useAtom(atomSelectSeason);
  const resetBetAnimeWorkId = useResetAtom(atomBetAnimeWorkId);
  const resetAllBetCoins = useSetAtom(atomResetBetCoins);

  const resetHandler = () => {
    resetAllBetCoins(); // Reset the bet coins
    resetBetAnimeWorkId(); // Reset the selected works
  };

  // 年の選択肢を生成（2000年から現在まで）
  const years = Array.from(
    { length: thisYear - 1999 },
    (_, i) => thisYear + 1 - i,
  );
  // const years = Array.from({ length: 10 }, (_, i) => thisYear - i);

  // 季節の選択肢
  const seasons = [
    { id: "winter", name: "冬" },
    { id: "spring", name: "春" },
    { id: "summer", name: "夏" },
    { id: "autumn", name: "秋" },
  ];

  const routeHandler = () => {
    resetHandler();
    router.push(`/seasons/${selectedYear}-${selectedSeason}`);
  };

  return (
    <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
      <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="w-24 md:w-28 h-9 text-sm">
          <SelectValue placeholder="年" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}年
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={selectedSeason}
        onValueChange={(value) => setSelectedSeason(value as Season)}
      >
        <SelectTrigger className="w-20 h-9 text-sm">
          <SelectValue placeholder="季節" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((season) => (
            <SelectItem key={season.id} value={season.id}>
              {season.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button 
        className="h-9 px-3 md:px-4 text-sm" 
        onClick={routeHandler}
      >
        表示
      </Button>
    </div>
  );
}
