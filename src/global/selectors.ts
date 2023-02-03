import { selector } from 'recoil'

import { AtomFetchThisSeason, betCoinValueAtomFamily } from './atoms'

export const selectorTotalCoin = selector({
  key: 'selector/TotalCoin',
  get: ({ get }) => {
    const currentSearch = get(AtomFetchThisSeason)
    const cointValueList: number[] = []
    currentSearch.nodes.map((work) => {
      const coinValue = get(betCoinValueAtomFamily(work.annictId))
      cointValueList.push(coinValue)
    })
    const sum = cointValueList.reduce((sum, num) => sum + num, 0)
    return sum
  },
})
