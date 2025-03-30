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
    <div className="grid grid-cols-12 gap-8 bg-card shadow p-4 rounded-sm">
      <div className="col-span-4 flex w-full">
        <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="年を選択" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Select
        defaultValue={selectedSeason}
        onValueChange={(value) => setSelectedSeason(value as Season)}
      >
        <SelectTrigger className="w-full col-span-4">
          <SelectValue placeholder="季節を選択" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((season) => (
            <SelectItem key={season.id} value={season.id}>
              {season.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button className="w-full sm:w-auto col-span-4" onClick={routeHandler}>
        表示
      </Button>
    </div>
  );
}
