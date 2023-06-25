import { selector } from 'recoil'

import { AtomFamilybetCoinValue, AtomFetchCurrentSeason } from '@/global/atoms'
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

export const selectorGetBetAnimeListWithCoinValue = selector({
  key: 'selector/GetBetAnimeListWithCoinValue',
  get: ({ get }) => {
    const currentSearchWorks = get(AtomFetchCurrentSeason)
    const betAnimeList: { annict_id: number; coin_value: number }[] = []
    // [{"annict_id": 1, "coin_value": 1000}, {"annict_id": 2, "coin_value": 2000}]のような形で返す
    currentSearchWorks.nodes.map((work) => {
      const coinValue = get(AtomFamilybetCoinValue(work.annictId))
      if (coinValue > 0) {
        betAnimeList.push({ annict_id: work.annictId, coin_value: coinValue })
      }
    })
    return betAnimeList
  },
})
