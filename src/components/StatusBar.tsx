/* eslint-disable jsx-a11y/alt-text */
import { GrPowerReset } from 'react-icons/gr'
import { TbCheck } from 'react-icons/tb'
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'

import { ActionIcon, Flex, Group, Image, Text, Tooltip } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

import { AtomIsCurrentModalOpened, AtomIsNextModalOpened } from '@/global/atoms'
import {
  selectorClearBetAnimeListCurrentSeason,
  selectorClearBetAnimeListNextSeason,
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
    <Flex align='center' gap='xl' justify='center'>
      <Tooltip label='リセット'>
        <ActionIcon variant='light' color='orange' onClick={() => resetBetCoin()}>
          <GrPowerReset />
        </ActionIcon>
      </Tooltip>
      <Text>賭けたコイン</Text>
      <Group>
        <ActionIcon size='xs' variant='transparent' disabled>
          <Image src='https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa99.png' />
        </ActionIcon>
        {totalValue.toLocaleString()}枚
      </Group>
      <Tooltip label='結果を表示'>
        <ActionIcon
          variant='light'
          color='cyan'
          onClick={() => {
            totalValue > 0 ? setModalOpened(true) : notificationError()
          }}
        >
          <TbCheck />
        </ActionIcon>
      </Tooltip>
    </Flex>
  )
}

export function NextStatus() {
  const totalValue = useRecoilValue(selectorTotalCoinNextSeason)
  const setModalOpened = useSetRecoilState(AtomIsNextModalOpened)
  const resetBetCoin = useResetRecoilState(selectorClearBetAnimeListNextSeason)
  return (
    <Flex align='center' gap='xl' justify='center'>
      <Tooltip label='リセット'>
        <ActionIcon variant='light' color='orange' onClick={() => resetBetCoin()}>
          <GrPowerReset />
        </ActionIcon>
      </Tooltip>
      <Text>賭けたコイン</Text>
      <Group>
        <ActionIcon size='xs' variant='transparent' disabled>
          <Image src='https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa99.png' />
        </ActionIcon>
        <Text>{totalValue.toLocaleString()}枚</Text>
      </Group>
      <Tooltip label='結果を表示'>
        <ActionIcon
          variant='light'
          color='cyan'
          onClick={() => {
            totalValue > 0 ? setModalOpened(true) : notificationError()
          }}
        >
          <TbCheck />
        </ActionIcon>
      </Tooltip>
    </Flex>
  )
}
