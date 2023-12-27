import Link from 'next/link'
import { useRecoilState, useRecoilValue } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

import { Button, Group, LoadingOverlay, Modal, Table, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { AtomIsCurrentModalOpened } from '@/global/atoms'
import {
  selectorGetBetAnimeListCurrentSeason,
  selectorGetBetAnimeListWithCoinValue,
} from '@/global/selectors'
import { createBetData } from '@/utils/crud'
import { generateRandomString } from '@/utils/generate'

type modalProps = {
  seasonName: string
}

export function ConfirmModal({ seasonName }: modalProps) {
  const [modalOpened, setModalOpened] = useRecoilState(AtomIsCurrentModalOpened)
  const { betAnimeList, coinValueList } = useRecoilValue(selectorGetBetAnimeListCurrentSeason)
  const betWithCoinValues = useRecoilValue(selectorGetBetAnimeListWithCoinValue)
  const [visible, { toggle }] = useDisclosure(false)
  const resultId = uuidv4()
  const deleteId = generateRandomString(8)
  const betWithCoinValuesData = betWithCoinValues.map((item) => {
    return { ...item, created_id: resultId, season: seasonName, delete_id: deleteId }
  })
  const createBetHandler = () => {
    createBetData(betWithCoinValuesData)
    toggle()
  }

  const confirmList = betAnimeList.map((work, idx) => (
    <tr key={work.annictId}>
      <td>
        <Text>{work.title}</Text>
      </td>
      <td>
        <Text>{coinValueList[idx].toLocaleString()}</Text>
      </td>
    </tr>
  ))
  return (
    <Modal
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      centered
      overlayBlur={3}
      title='以下のアニメに賭けますか？'
    >
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <Table>
        <thead>
          <tr>
            <th>作品名</th>
            <th>コイン数</th>
          </tr>
        </thead>
        <tbody>{confirmList}</tbody>
      </Table>
      <Group position='center' className='flex justify-center'>
        <Button variant='default' onClick={() => setModalOpened(false)}>
          戻る
        </Button>
        <Link href={`/results/${deleteId}?id=${resultId}`}>
          <Button color='cyan' onClick={() => createBetHandler()}>
            結果を表示
          </Button>
        </Link>
        {deleteId}
      </Group>
    </Modal>
  )
}
