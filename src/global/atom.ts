import { type Season, getCurrentSeason } from "@/lib/seasons";
import { atom } from "jotai";
import { atomFamily, atomWithReset } from "jotai/utils";

export const atomBetAnimeWorkId = atomWithReset<number[]>([]);

// { work_id: 1, title: "title", amount: 0 }
export const atomBetAnimeWork = atomFamily((id: number) =>
  atomWithReset<{ work_id: number; title: string; amount: number }>({
    work_id: id,
    title: "",
    amount: 0,
  })
);

export const atomSelectWorkCount = atom((get) => {
  const betCoin = get(atomBetAnimeWorkId);
  return betCoin.length;
});

export const atomTotalCoinValue = atom((get) => {
  const betWorks = get(atomBetAnimeWorkId);
  const totalCoin = betWorks.reduce((acc, id) => {
    const { amount } = get(atomBetAnimeWork(id));
    return acc + amount;
  }, 0);
  return totalCoin;
});

// [ {annict_id: 1, total_coin_value: 100}, {annict_id: 2, total_coin_value: 200} ]
export const atomBetCoinValue = atom((get) => {
  const betWorks = get(atomBetAnimeWorkId);
  const betCoinValue = betWorks
    .map((id) => {
      const { amount, title } = get(atomBetAnimeWork(id));
      return amount > 0
        ? {
            annict_id: id,
            title: title,
            coin_value: amount,
          }
        : null;
    })
    .filter((item) => item !== null); // Remove entries with total_coin_value of 0
  return betCoinValue;
});

export const atomResetBetCoins = atom(null, (get, set) => {
  const betWorks = get(atomBetAnimeWorkId);
  for (const id of betWorks) {
    set(atomBetAnimeWork(id), {
      work_id: id,
      title: "",
      amount: 0,
    }); // Reset each atomBetAnimeWork to initial state
  }
});

const now = new Date();
const currentSeason = getCurrentSeason();
export const atomSelectYear = atom(now.getFullYear().toString());
export const atomSelectSeason = atom<Season>(currentSeason.id);
