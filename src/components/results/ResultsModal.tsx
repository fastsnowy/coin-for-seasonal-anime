/* eslint-disable jsx-a11y/alt-text */
import { TbBrandTwitter, TbPhoto, TbTable } from 'react-icons/tb'
import { useRecoilState, useRecoilValue } from 'recoil'

import { ActionIcon, Button, Container, Group, Image, Mark, Modal, Tabs } from '@mantine/core'

import { TwitterIntentTweet } from '../TwitterShare'

import { ResultCurrentCard, ResultNextCard } from './ResultsCard'
import { ResultsCurrentTable, ResultsNextTable } from './ResultsTable'

import { DEPLOY_URL } from '@/configs'
import { AtomIsCurrentModalOpened, AtomIsNextModalOpened } from '@/global/atoms'
import { selectorTotalCoinCurrentSeason, selectorTotalCoinNextSeason } from '@/global/selectors'
import { getSeasons } from '@/utils/getseason'

export function ResultCurrentModal() {
  const [modalOpened, setModalOpened] = useRecoilState(AtomIsCurrentModalOpened)
  const totalBet = useRecoilValue(selectorTotalCoinCurrentSeason)
  const season = getSeasons()
  const seasonsText = season.current
    .replace('winter', '冬')
    .replace('spring', '春')
    .replace('summer', '夏')
    .replace('autumn', '秋')
  const shareText = `${seasonsText}アニメに合計${totalBet.toLocaleString()}枚のアニメコインを賭けました！`
  return (
    <Modal
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      centered
      fullScreen
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
          <Container size='md'>
            <ResultsCurrentTable />
          </Container>
        </Tabs.Panel>
        <Tabs.Panel value='card' pt='xs'>
          <ResultCurrentCard />
        </Tabs.Panel>
      </Tabs>
      <Container>
        <Group position='center'>
          <Button
            component={TwitterIntentTweet}
            text={shareText}
            url={DEPLOY_URL}
            color='blue'
            leftIcon={<TbBrandTwitter />}
            size='sm'
          >
            ツイート
          </Button>
          <Button variant='default' onClick={() => setModalOpened(false)} size='sm'>
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
  const season = getSeasons()
  const seasonsText = season.next
    .replace('winter', '冬')
    .replace('spring', '春')
    .replace('summer', '夏')
    .replace('autumn', '秋')
  const shareText = `${seasonsText}アニメに合計${totalBet.toLocaleString()}枚のアニメコインを賭けました！`
  return (
    <Modal
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      centered
      fullScreen
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
          <Button
            component={TwitterIntentTweet}
            text={shareText}
            url={DEPLOY_URL}
            color='blue'
            leftIcon={<TbBrandTwitter />}
            size='sm'
          >
            ツイート
          </Button>
          <Button variant='default' onClick={() => setModalOpened(false)} size='sm'>
            閉じる
          </Button>
        </Group>
      </Container>
    </Modal>
  )
}
