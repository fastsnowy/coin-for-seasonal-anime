import { selector } from 'recoil'

import { AtomFamilybetCoinValue, AtomFetchNextSeason, AtomFetchThisSeason } from './atoms'

import { nodes } from '@/types/annict'

export const selectorTotalCoinCurrentSeason = selector({
  key: 'selector/TotalCoinCurrentSeason',
  get: ({ get }) => {
    const currentSearchWorks = get(AtomFetchThisSeason)
    const cointValueList: number[] = []
    currentSearchWorks.nodes.map((work) => {
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
    const nextSearchWorks = get(AtomFetchNextSeason)
    const cointValueList: number[] = []
    nextSearchWorks.nodes.map((work) => {
      const coinValue = get(AtomFamilybetCoinValue(work.annictId))
      cointValueList.push(coinValue)
    })
    const sum = cointValueList.reduce((sum, num) => sum + num, 0)
    return sum
  },
})

export const selectorGetBetAnimeListCurrentSeason = selector({
  key: 'selector/GetBetAnimeListCurrentSeason',
  get: ({ get }) => {
    const currentSearchWorks = get(AtomFetchThisSeason)
    const betAnimeList: nodes[] = []
    const coinValueList: number[] = []
    currentSearchWorks.nodes.map((work) => {
      const coinValue = get(AtomFamilybetCoinValue(work.annictId))
      if (coinValue > 0) {
        betAnimeList.push(work)
        coinValueList.push(coinValue)
      }
    })
    return { betAnimeList, coinValueList }
  },
})
