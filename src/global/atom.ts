import { type Season, getCurrentSeason } from "@/lib/seasons";
import { atom } from "jotai";
import { atomFamily, atomWithReset } from "jotai/utils";

export const atomFamilyBetCoin = atomFamily((id: number) => atomWithReset(0));

export const atomBetAnimeWorkId = atomWithReset<number[]>([]);

export const atomSelectWorkCount = atom((get) => {
  const betCoin = get(atomBetAnimeWorkId);
  return betCoin.length;
});

export const atomTotalCoinValue = atom((get) => {
  const betWorks = get(atomBetAnimeWorkId);
  const totalCoin = betWorks.reduce((acc, id) => {
    const coin = get(atomFamilyBetCoin(id));
    return acc + coin;
  }, 0);
  return totalCoin;
});

// [ {annict_id: 1, total_coin_value: 100}, {annict_id: 2, total_coin_value: 200} ]
export const atomBetCoinValue = atom((get) => {
  const betWorks = get(atomBetAnimeWorkId);
  const betCoinValue = betWorks
    .map((id) => {
      const coin = get(atomFamilyBetCoin(id));
      return coin > 0
        ? {
            annict_id: id,
            total_coin_value: coin,
          }
        : null;
    })
    .filter((item) => item !== null); // Remove entries with total_coin_value of 0
  return betCoinValue;
});

export const atomResetBetCoins = atom(null, (get, set) => {
  const betWorks = get(atomBetAnimeWorkId);
  for (const id of betWorks) {
    set(atomFamilyBetCoin(id), 0); // Reset each atomFamilyBetCoin to 0
  }
});

const now = new Date();
const currentSeason = getCurrentSeason();
export const atomSelectYear = atom(now.getFullYear().toString());
export const atomSelectSeason = atom<Season>(currentSeason.id);
