import { selector } from 'recoil'

import { AtomFamilybetCoinValue, AtomFetchNextSeason, AtomFetchCurrentSeason } from '@/global/atoms'
import { nodes } from '@/types/annict'

export const selectorTotalCoinCurrentSeason = selector({
  key: 'selector/TotalCoinCurrentSeason',
  get: ({ get }) => {
    const currentSearchWorks = get(AtomFetchCurrentSeason)
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
    const currentSearchWorks = get(AtomFetchCurrentSeason)
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

export const selectorGetBetAnimeListNextSeason = selector({
  key: 'selector/GetBetAnimeListNextSeason',
  get: ({ get }) => {
    const nextSearchWorks = get(AtomFetchNextSeason)
    const betAnimeList: nodes[] = []
    const coinValueList: number[] = []
    nextSearchWorks.nodes.map((work) => {
      const coinValue = get(AtomFamilybetCoinValue(work.annictId))
      if (coinValue > 0) {
        betAnimeList.push(work)
        coinValueList.push(coinValue)
      }
    })
    return { betAnimeList, coinValueList }
  },
})

export const selectorClearBetAnimeListCurrentSeason = selector({
  key: 'selector/ClearBetAnimeListCurrentSeason',
  get: ({ get }) => {
    const currentSearchWorks = get(AtomFetchCurrentSeason)
    return currentSearchWorks
  },
  set: ({ reset, get }) => {
    const currentSearchWorks = get(AtomFetchCurrentSeason)
    currentSearchWorks.nodes.map((work) => {
      reset(AtomFamilybetCoinValue(work.annictId))
    })
  },
})

export const selectorClearBetAnimeListNextSeason = selector({
  key: 'selector/ClearBetAnimeListNextSeason',
  get: ({ get }) => {
    const currentSearchWorks = get(AtomFetchNextSeason)
    return currentSearchWorks
  },
  set: ({ reset, get }) => {
    const currentSearchWorks = get(AtomFetchNextSeason)
    currentSearchWorks.nodes.map((work) => {
      reset(AtomFamilybetCoinValue(work.annictId))
    })
  },
})
