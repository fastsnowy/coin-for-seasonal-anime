"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { atomSelectSeason, atomSelectYear } from "@/global/atom";
import { type Season, getCurrentSeason, getNextSeason } from "@/lib/seasons";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

interface SeasonNavigationProps {
  currentYear: number;
  currentSeason: Season;
}

export default function SeasonNavigation({
  currentYear,
  currentSeason,
}: SeasonNavigationProps) {
  const router = useRouter();
  const now = new Date();
  const thisYear = now.getFullYear();

  // 現在の季節と来期の季節を取得
  const currentSeasonInfo = getCurrentSeason();
  const nextSeasonInfo = getNextSeason();

  // 過去の年と季節の選択状態
  const [selectedYear, setSelectedYear] = useAtom(atomSelectYear);

  const [selectedSeason, setSelectedSeason] = useAtom(atomSelectSeason);

  // タブの初期値を設定
  let defaultTab = "past";
  if (currentYear === thisYear && currentSeason === currentSeasonInfo.id) {
    defaultTab = "current";
  } else if (
    currentYear === nextSeasonInfo.year &&
    currentSeason === nextSeasonInfo.id
  ) {
    defaultTab = "next";
  }

  // 年の選択肢を生成（2000年から現在まで）
  const years = Array.from({ length: thisYear - 1999 }, (_, i) => thisYear - i);
  // const years = Array.from({ length: 10 }, (_, i) => thisYear - i);

  // 季節の選択肢
  const seasons = [
    { id: "spring", name: "春" },
    { id: "summer", name: "夏" },
    { id: "autumn", name: "秋" },
    { id: "winter", name: "冬" },
  ];

  // 過去のアニメを表示する処理
  const handleShowPastSeason = () => {
    router.push(`/seasons/${selectedYear}-${selectedSeason}`);
  };

  return (
    <div className="mb-8 bg-card rounded-lg p-4 shadow-sm">
      <Tabs
        defaultValue={defaultTab}
        // onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="past">シーズンを選択</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="pt-4">
          <p className="text-center text-muted-foreground">
            {thisYear} {currentSeasonInfo.name}
          </p>
        </TabsContent>

        <TabsContent value="next" className="pt-4">
          <p className="text-center text-muted-foreground">
            {nextSeasonInfo.year} {nextSeasonInfo.name}
          </p>
        </TabsContent>

        <TabsContent value="past" className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="w-full sm:w-1/3">
              <Select
                defaultValue={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger>
                  <SelectValue placeholder="年を選択" className="w-full" />
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

            <div className="w-full sm:w-1/3">
              <Select
                defaultValue={selectedSeason}
                onValueChange={(value) => setSelectedSeason(value as Season)}
              >
                <SelectTrigger>
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
            </div>

            <Button className="w-full sm:w-auto" onClick={handleShowPastSeason}>
              表示
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
