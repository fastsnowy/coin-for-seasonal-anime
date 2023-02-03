import { selector } from 'recoil'

import { AtomFamilybetCoinValue, AtomFetchNextSeason, AtomFetchThisSeason } from './atoms'

export const selectorTotalCoinCurrentSeason = selector({
  key: 'selector/TotalCoinCurrentSeason',
  get: ({ get }) => {
    const currentSearch = get(AtomFetchThisSeason)
    const cointValueList: number[] = []
    currentSearch.nodes.map((work) => {
      const coinValue = get(AtomFamilybetCoinValue(work.annictId))
      cointValueList.push(coinValue)
    })
    const sum = cointValueList.reduce((sum, num) => sum + num, 0)
    return sum
  },
})

export const selectorTotalCoinNextSeason = selector({
  key: 'selector/TotalCoinNextSeason',
  get: ({ get }) => {
    const currentSearch = get(AtomFetchNextSeason)
    const cointValueList: number[] = []
    currentSearch.nodes.map((work) => {
      const coinValue = get(AtomFamilybetCoinValue(work.annictId))
      cointValueList.push(coinValue)
    })
    const sum = cointValueList.reduce((sum, num) => sum + num, 0)
    return sum
  },
})
