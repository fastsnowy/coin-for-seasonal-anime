import { GrPowerReset } from 'react-icons/gr'
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'

import { Button, Flex, Text, Tooltip } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

import { AtomIsCurrentModalOpened, AtomIsNextModalOpened } from '@/global/atoms'
import {
  selectorClearBetAnimeListCurrentSeason,
  selectorTotalCoinCurrentSeason,
  selectorTotalCoinNextSeason,
} from '@/global/selectors'

const notificationError = () => {
  showNotification({
    title: 'エラー',
    message: '少なくとも1枚以上のコインを賭けてください',
    color: 'red',
  })
}

export function CurrentStatus() {
  const totalValue = useRecoilValue(selectorTotalCoinCurrentSeason)
  const setModalOpened = useSetRecoilState(AtomIsCurrentModalOpened)
  const resetBetCoin = useResetRecoilState(selectorClearBetAnimeListCurrentSeason)
  return (
    <Flex align='center' gap='lg' justify='center'>
      <Tooltip label='リセット'>
        <Button variant='light' color='orange' onClick={() => resetBetCoin()}>
          <GrPowerReset />
        </Button>
      </Tooltip>
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
