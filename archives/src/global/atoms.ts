import { atom, atomFamily } from "recoil";

import type { annictWorks } from "@/types/annict";

export const AtomFamilybetCoinValue = atomFamily<number, number>({
  key: "betCoinValue",
  default: 0,
});

export const AtomFamilyTotalCoinValue = atomFamily<number, number>({
  key: "totalCoinValue",
  default: 0,
});

export const AtomtotalCoinCount = atom({
  key: "totalCoin",
  default: 0,
});

export const AtomFetchCurrentSeason = atom<annictWorks>({
  key: "fetch/currentSeason",
});

export const AtomIsCurrentModalOpened = atom({
  key: "isCurrentSeasonModalOpened",
  default: false,
});
