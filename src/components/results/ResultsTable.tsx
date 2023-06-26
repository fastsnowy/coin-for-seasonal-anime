/* eslint-disable jsx-a11y/alt-text */
import { useRecoilState } from 'recoil'

import { ActionIcon, Card, Group, Image, Stack, Text, Tooltip } from '@mantine/core'

import { AtomFamilyTotalCoinValue } from '@/global/atoms'
import { nodes } from '@/types/annict'
import { betAnimes } from '@/types/coins'

type resultTableProps = {
  work: nodes
  betAnimes: betAnimes
  totalCoins: { annict_id: number; total_coin_value: number }[]
}

export function ResultsTable({ work, betAnimes, totalCoins }: resultTableProps) {
  // annictIdごとのcoin_valueの合計を取得
  const [totalCoinValue, setTotalCoinValue] = useRecoilState(
    AtomFamilyTotalCoinValue(work.annictId),
  )
  totalCoins.map((item) => {
    if (item.annict_id === work.annictId) {
      setTotalCoinValue(item.total_coin_value)
    }
  })
  // work.annictIdとbetAnimes.annict_idが一致する時のcoin_valueを取得
  const coinValueList = betAnimes.map((item) => {
    if (item.annict_id === work.annictId) {
      return item.coin_value
    } else {
      return 0
    }
  })
  const idx = coinValueList.findIndex((item) => item !== 0)

  const tableItems = (
    <tr key={work.annictId}>
      <td>
        <Card
          shadow='md'
          radius='md'
          p='lg'
          sx={(theme) => ({
            backgroundImage: work.image?.recommendedImageUrl
              ? `url(${work.image?.recommendedImageUrl})`
              : `url(${work.image?.facebookOgImageUrl})`,
            backgroundColor: 'rgba(30,30,30,0.6)',
            backgroundBlendMode: 'darken',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[4],
          })}
        >
          <Group className='flex justify-between'>
            <Tooltip label='視聴者数'>
              <Text>{work.watchersCount.toLocaleString()} watchers</Text>
            </Tooltip>
            <Tooltip label='コイン総数'>
              <Text>{totalCoinValue.toLocaleString()} coins</Text>
            </Tooltip>
          </Group>
          <Stack align='flex-start'>
            <Text align='center' size='lg' weight='bold' className='items-center text-center'>
              {work.title}
            </Text>
          </Stack>
        </Card>
      </td>
      <td className='whitespace-nowrap'>
        <Group position='center'>
          <ActionIcon size='xs' variant='transparent' disabled>
            <Image
              src='https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa99.png'
              alt='coin-icon'
            />
          </ActionIcon>
          <Text align='center'>{coinValueList[idx].toLocaleString()}</Text>
        </Group>
      </td>
    </tr>
  )
  return tableItems
}
