/* eslint-disable jsx-a11y/alt-text */
import { TbPhoto, TbTable } from 'react-icons/tb'
import { useRecoilState, useRecoilValue } from 'recoil'

import { ActionIcon, Button, Container, Group, Image, Mark, Modal, Tabs } from '@mantine/core'

import { ResultCurrentCard, ResultNextCard } from './ResultsCard'
import { ResultsCurrentTable, ResultsNextTable } from './ResultsTable'

import { AtomIsCurrentModalOpened, AtomIsNextModalOpened } from '@/global/atoms'
import { selectorTotalCoinCurrentSeason, selectorTotalCoinNextSeason } from '@/global/selectors'

export function ResultCurrentModal() {
  const [modalOpened, setModalOpened] = useRecoilState(AtomIsCurrentModalOpened)
  const totalBet = useRecoilValue(selectorTotalCoinCurrentSeason)
  return (
    <Modal
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      centered
      fullScreen
      size='90%'
      // title='結果'
      overlayBlur={3}
    >
      <Group position='center'>
        合計
        <ActionIcon size='xs' variant='transparent' disabled>
          <Image src='https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa99.png' />
        </ActionIcon>
        <Mark>{totalBet.toLocaleString()}枚</Mark>のコインを賭けました
      </Group>
      <Tabs defaultValue='table'>
        <Tabs.List position='right'>
          <Tabs.Tab value='table' icon={<TbTable size={14} />}></Tabs.Tab>
          <Tabs.Tab value='card' icon={<TbPhoto size={14} />}></Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='table' pt='xs'>
          <Container size='xl'>
            <ResultsCurrentTable />
          </Container>
        </Tabs.Panel>
        <Tabs.Panel value='card' pt='xs'>
          <ResultCurrentCard />
        </Tabs.Panel>
      </Tabs>
      <Container>
        <Group position='center'>
          <Button variant='default' onClick={() => setModalOpened(false)}>
            閉じる
          </Button>
        </Group>
      </Container>
    </Modal>
  )
}

export function ResultNextModal() {
  const [modalOpened, setModalOpened] = useRecoilState(AtomIsNextModalOpened)
  const totalBet = useRecoilValue(selectorTotalCoinNextSeason)
  return (
    <Modal
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      centered
      fullScreen
      size='90%'
      // title='結果'
      overlayBlur={3}
    >
      <Group position='center'>
        合計
        <ActionIcon size='xs' variant='transparent' disabled>
          <Image src='https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa99.png' />
        </ActionIcon>
        <Mark>{totalBet.toLocaleString()}枚</Mark>のコインを賭けました
      </Group>
      <Tabs defaultValue='table'>
        <Tabs.List position='right'>
          <Tabs.Tab value='table' icon={<TbTable size={14} />}></Tabs.Tab>
          <Tabs.Tab value='card' icon={<TbPhoto size={14} />}></Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='table' pt='xs'>
          <Container size='xl'>
            <ResultsNextTable />
          </Container>
        </Tabs.Panel>
        <Tabs.Panel value='card' pt='xs'>
          <ResultNextCard />
        </Tabs.Panel>
      </Tabs>
      <Container>
        <Group position='center'>
          <Button variant='default' onClick={() => setModalOpened(false)}>
            閉じる
          </Button>
        </Group>
      </Container>
    </Modal>
  )
}
