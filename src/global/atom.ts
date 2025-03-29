import { type Season, getCurrentSeason } from "@/lib/seasons";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

export const atomFamilyBetCoin = atomFamily((id: number) => atom(0));

export const atomBetAnimeWorkId = atom<number[]>([]);

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

const now = new Date();
const currentSeason = getCurrentSeason();
export const atomSelectYear = atom(now.getFullYear().toString());
export const atomSelectSeason = atom<Season>(currentSeason.id);
