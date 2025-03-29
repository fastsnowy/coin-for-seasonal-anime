import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  atomBetCoinValue,
  atomSelectSeason,
  atomSelectYear,
} from "@/global/atom";
import { supabase } from "@/lib/supabaseClient";
import { useAtomValue } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const currentSeasonName = () => {
  const year = useAtomValue(atomSelectYear);
  const season = useAtomValue(atomSelectSeason);
  return `${year}-${season}`;
};

type BetAnimes = {
  annict_id: number;
  title: string;
  coin_value: number;
}[];

const insertDataSchema = z.array(
  z.object({
    annict_id: z.number().int().positive(),
    coin_value: z.number().int().min(1).max(100),
    season: z.string().regex(/^\d{4}-(spring|summer|autumn|winter)$/),
    created_id: z.string().uuid(),
  }),
);

const createVoteHandler = async (betanimes: BetAnimes, seasonName: string) => {
  if (betanimes.length === 0) {
    console.error("No bet animes to create vote for.");
    return;
  }
  const resultId = uuidv4();

  const insertData = betanimes.map((item) => ({
    annict_id: item.annict_id,
    coin_value: item.coin_value,
    season: seasonName,
    created_id: resultId,
  }));

  const validationResult = insertDataSchema.safeParse(insertData);

  if (!validationResult.success) {
    console.error("Validation failed:", validationResult.error.errors);
    return;
  }

  const { error } = await supabase.from("dev_coins").insert(insertData);

  if (error) {
    console.error("Error creating vote:", error);
    return;
  }
};

export function DialogDemo({ seasonName }: { seasonName: string }) {
  const betCoinValue = useAtomValue(atomBetCoinValue);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          投票内容を確認
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>投票内容の確認</DialogTitle>
          <DialogDescription>以下は現在の投票内容です。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {betCoinValue.length > 0 ? (
            betCoinValue.map((item) => (
              <div
                key={item.annict_id}
                className="flex justify-between items-center"
              >
                <span>{`${item.title}`}</span>
                <span>{`${item.coin_value} コイン`}</span>
              </div>
            ))
          ) : (
            <p>現在、投票内容はありません。</p>
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              createVoteHandler(betCoinValue, seasonName);
              console.log("投票内容", betCoinValue);
              console.log("投票内容を送信しました");
            }}
          >
            投票する
          </Button>

          <DialogClose asChild>
            <Button type="button" variant="outline">
              閉じる
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
