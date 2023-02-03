import { atom, atomFamily } from 'recoil'

import { annictWorks } from '@/types/annict'

export const betCoinValueAtomFamily = atomFamily({
  key: 'betCoinValue',
  default: 0,
})

export const totalCoinCountAtom = atom({
  key: 'totalCoin',
  default: 0,
})

export const AtomFetchThisSeason = atom<annictWorks>({
  key: 'Data/ThisSeason',
})
