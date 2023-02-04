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

export const AtomFetchThisSeason = atom<annictWorks>({
  key: 'Data/ThisSeason',
})

export const AtomFetchNextSeason = atom<annictWorks>({
  key: 'Data/NextSeason',
})

export const AtomIsCurrentModalOpened = atom({
  key: 'isModalOpened',
  default: false,
})
