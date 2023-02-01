import { atom, atomFamily, RecoilState, useRecoilCallback } from 'recoil'

export const betCoinValueAtomFamily = atomFamily({
  key: 'betCoinValue',
  default: 0,
})

export const betAnnictId = atom({
  key: 'betAnnictId',
  default: [],
})
