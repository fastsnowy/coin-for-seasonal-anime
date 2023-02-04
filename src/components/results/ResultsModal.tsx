import { TbPhoto, TbTable } from 'react-icons/tb'
import { useRecoilState, useRecoilValue } from 'recoil'

import { Container, Mark, Modal, Tabs, Text } from '@mantine/core'

import { ResultCurrentCard } from './ResultsCard'
import { ResultsCurrentTable } from './ResultsTable'

import { AtomIsCurrentModalOpened } from '@/global/atoms'
import { selectorTotalCoinCurrentSeason } from '@/global/selectors'

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
      <Text size='lg' align='center'>
        合計🪙<Mark>{totalBet.toLocaleString()}枚</Mark>のコインを賭けました
      </Text>
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
    </Modal>
  )
}
