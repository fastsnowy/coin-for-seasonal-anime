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

export const AtomFetchNextSeason = atom<annictWorks>({
  key: 'fetch/NextSeason',
})

export const AtomIsCurrentModalOpened = atom({
  key: 'isCurrentSeasonModalOpened',
  default: false,
})

export const AtomIsNextModalOpened = atom({
  key: 'isNextSeasonModalOpened',
  default: false,
})
