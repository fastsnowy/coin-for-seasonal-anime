/* eslint-disable jsx-a11y/alt-text */
import { TbBrandTwitter, TbPhoto, TbTable } from 'react-icons/tb'
import { useRecoilState, useRecoilValue } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

import { ActionIcon, Button, Container, Group, Image, Mark, Modal, Tabs } from '@mantine/core'

import { TwitterIntentTweet } from '../TwitterShare'

import { ResultCurrentCard } from './ResultsCard'
import { ResultsCurrentTable } from './ResultsTable'

import { DEPLOY_URL } from '@/configs'
import { AtomIsCurrentModalOpened } from '@/global/atoms'
import {
  selectorGetBetAnimeListWithCoinValue,
  selectorTotalCoinCurrentSeason,
} from '@/global/selectors'
import { createBetData } from '@/utils/crud'
// uuidv4

type modalProps = {
  seasonName: string
}

export function ResultCurrentModal({ seasonName }: modalProps) {
  const [modalOpened, setModalOpened] = useRecoilState(AtomIsCurrentModalOpened)
  const totalBet = useRecoilValue(selectorTotalCoinCurrentSeason)
  const betwithCoinValue = useRecoilValue(selectorGetBetAnimeListWithCoinValue)
  const resultId = uuidv4()
  const insertBetData = betwithCoinValue.map((item) => {
    return { ...item, season: seasonName, created_id: resultId }
  })
  const seasonsText = seasonName
    .replace('winter', '冬')
    .replace('spring', '春')
    .replace('summer', '夏')
    .replace('autumn', '秋')
  const shareText = `${seasonsText}アニメに合計${totalBet.toLocaleString()}枚のコインを賭けました！`
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
            <ResultsCurrentTable />
          </Container>
        </Tabs.Panel>
        <Tabs.Panel value='card' pt='xs'>
          <ResultCurrentCard />
        </Tabs.Panel>
      </Tabs>
      <Container>
        <Group position='center' className='flex justify-center'>
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
          <Button onClick={() => createBetData(insertBetData)}>WIP{resultId}</Button>
        </Group>
      </Container>
    </Modal>
  )
}
