import { atom, atomFamily } from 'recoil'

import { annictWorks } from '@/types/annict'

export const AtomFamilybetCoinValue = atomFamily({
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
