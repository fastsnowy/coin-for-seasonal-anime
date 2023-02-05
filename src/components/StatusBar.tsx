import { useRecoilValue, useSetRecoilState } from 'recoil'

import { Button, Flex, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

import { AtomIsCurrentModalOpened, AtomIsNextModalOpened } from '@/global/atoms'
import { selectorTotalCoinCurrentSeason, selectorTotalCoinNextSeason } from '@/global/selectors'

const notificationError = () => {
  showNotification({
    title: 'エラー',
    message: '0枚以上のコインを賭けてください',
    color: 'red',
  })
}

export function CurrentStatus() {
  const totalValue = useRecoilValue(selectorTotalCoinCurrentSeason)
  const setModalOpened = useSetRecoilState(AtomIsCurrentModalOpened)
  return (
    <Flex align='center' gap='lg' justify='center'>
      <Text>賭けたコイン</Text>
      <Text>🪙{totalValue.toLocaleString()}枚</Text>
      <Button
        variant='light'
        color='cyan'
        onClick={() => {
          totalValue > 0 ? setModalOpened(true) : notificationError()
        }}
      >
        <Text>結果を表示</Text>
      </Button>
    </Flex>
  )
}

export function NextStatus() {
  const totalValue = useRecoilValue(selectorTotalCoinNextSeason)
  const setModalOpened = useSetRecoilState(AtomIsNextModalOpened)
  return (
    <Flex align='center' gap='lg' justify='center'>
      <Text>賭けたコイン</Text>
      <Text>🪙{totalValue.toLocaleString()}枚</Text>
      <Button
        variant='light'
        color='cyan'
        onClick={() => (totalValue > 0 ? setModalOpened(true) : notificationError())}
      >
        <Text>結果を表示</Text>
      </Button>
    </Flex>
  )
}
