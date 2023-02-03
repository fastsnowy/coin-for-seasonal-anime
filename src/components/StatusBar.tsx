import { useRecoilValue } from 'recoil'

import { Button, Flex, Text } from '@mantine/core'

import { selectorTotalCoinCurrentSeason, selectorTotalCoinNextSeason } from '@/global/selectors'

export function CurrentStatus() {
  const totalValue = useRecoilValue(selectorTotalCoinCurrentSeason)

  return (
    <Flex align='center' gap='lg' justify='center'>
      <Text>賭けたコイン</Text>
      <Text>🪙{totalValue}枚</Text>
      <Button variant='light' color='cyan'>
        <Text>結果を表示</Text>
      </Button>
    </Flex>
  )
}

export function NextStatus() {
  const totalValue = useRecoilValue(selectorTotalCoinNextSeason)

  return (
    <Flex align='center' gap='lg' justify='center'>
      <Text>賭けたコイン</Text>
      <Text>🪙{totalValue}枚</Text>
      <Button variant='light' color='cyan'>
        <Text>結果を表示</Text>
      </Button>
    </Flex>
  )
}
