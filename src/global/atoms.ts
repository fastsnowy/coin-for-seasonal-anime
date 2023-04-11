import { atom, atomFamily } from 'recoil'

import { annictWorks } from '@/types/annict'

export const AtomFamilybetCoinValue = atomFamily<number, number>({
  key: 'betCoinValue',
  default: 0,
})

export const AtomtotalCoinCount = atom({
  key: 'totalCoin',
  default: 0,
})

export const AtomFetchCurrentSeason = atom<annictWorks>({
  key: 'fetch/currentSeason',
})

export const AtomIsCurrentModalOpened = atom({
  key: 'isCurrentSeasonModalOpened',
  default: false,
})
