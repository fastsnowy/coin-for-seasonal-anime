import { useRecoilValue, useSetRecoilState } from 'recoil'

import { Button, Flex, Text } from '@mantine/core'

import { AtomIsCurrentModalOpened } from '@/global/atoms'
import { selectorTotalCoinCurrentSeason, selectorTotalCoinNextSeason } from '@/global/selectors'

export function CurrentStatus() {
  const totalValue = useRecoilValue(selectorTotalCoinCurrentSeason)
  const setModalOpened = useSetRecoilState(AtomIsCurrentModalOpened)
  return (
    <Flex align='center' gap='lg' justify='center'>
      <Text>賭けたコイン</Text>
      <Text>🪙{totalValue.toLocaleString()}枚</Text>
      <Button variant='light' color='cyan' onClick={() => setModalOpened(true)}>
        <Text>結果を表示</Text>
      </Button>
    </Flex>
  )
}

export function NextStatus() {
  const totalValue = useRecoilValue(selectorTotalCoinNextSeason)
  const setModalOpened = useSetRecoilState(AtomIsCurrentModalOpened)
  return (
    <Flex align='center' gap='lg' justify='center'>
      <Text>賭けたコイン</Text>
      <Text>🪙{totalValue.toLocaleString()}枚</Text>
      <Button variant='light' color='cyan' onClick={() => setModalOpened(true)}>
        <Text>結果を表示</Text>
      </Button>
    </Flex>
  )
}
