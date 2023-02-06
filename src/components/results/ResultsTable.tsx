/* eslint-disable jsx-a11y/alt-text */
import { useRecoilValue } from 'recoil'

import {
  ActionIcon,
  Card,
  Group,
  Image,
  Progress,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core'

import {
  selectorGetBetAnimeListCurrentSeason,
  selectorGetBetAnimeListNextSeason,
  selectorTotalCoinCurrentSeason,
  selectorTotalCoinNextSeason,
} from '@/global/selectors'

export function ResultsCurrentTable() {
  const { betAnimeList, coinValueList } = useRecoilValue(selectorGetBetAnimeListCurrentSeason)
  const totalBet = useRecoilValue(selectorTotalCoinCurrentSeason)
  const tableItems = betAnimeList.map((work, idx) => (
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
          <Stack align='flex-start'>
            <Tooltip label='視聴者数'>
              <Text>{work.watchersCount.toLocaleString()} watchers</Text>
            </Tooltip>
            <Text align='center' size='lg' weight='bold' className='items-center text-center'>
              {betAnimeList[idx].title}
            </Text>
          </Stack>
        </Card>
      </td>
      <td className='whitespace-nowrap'>
        <Text align='center'>{coinValueList[idx].toLocaleString()}</Text>
        <Tooltip label={`${((coinValueList[idx] / totalBet) * 100).toPrecision(4)}%`}>
          <Progress
            value={(coinValueList[idx] / totalBet) * 100}
            size='md'
            px='sm'
            color='yellow'
          ></Progress>
        </Tooltip>
      </td>
    </tr>
  ))
  return (
    <Table fontSize='md' verticalSpacing='md'>
      <thead>
        <tr>
          <th>
            <Text align='center'>作品名</Text>
          </th>
          <th>
            <Group position='center'>
              <ActionIcon size='xs' variant='transparent' disabled>
                <Image src='https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa99.png' />
              </ActionIcon>
            </Group>
          </th>
        </tr>
      </thead>
      <tbody className='items-center text-center'>{tableItems}</tbody>
    </Table>
  )
}

export function ResultsNextTable() {
  const { betAnimeList, coinValueList } = useRecoilValue(selectorGetBetAnimeListNextSeason)
  const totalBet = useRecoilValue(selectorTotalCoinNextSeason)
  const tableItems = betAnimeList.map((work, idx) => (
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
          <Stack align='flex-start'>
            <Tooltip label='視聴者数'>
              <Text>{work.watchersCount.toLocaleString()} watchers</Text>
            </Tooltip>
            <Text align='center' size='lg' weight='bold' className='items-center text-center'>
              {betAnimeList[idx].title}
            </Text>
          </Stack>
        </Card>
      </td>
      <td className='whitespace-nowrap'>
        <Text align='center'>{coinValueList[idx].toLocaleString()}</Text>
        <Tooltip label={`${((coinValueList[idx] / totalBet) * 100).toPrecision(4)}%`}>
          <Progress
            value={(coinValueList[idx] / totalBet) * 100}
            size='md'
            px='sm'
            color='yellow'
          ></Progress>
        </Tooltip>
      </td>
    </tr>
  ))
  return (
    <Table fontSize='md' verticalSpacing='md'>
      <thead>
        <tr>
          <th>
            <Text align='center'>作品名</Text>
          </th>
          <th>
            <Group position='center'>
              <ActionIcon size='xs' variant='transparent' disabled>
                <Image src='https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa99.png' />
              </ActionIcon>
            </Group>
          </th>
        </tr>
      </thead>
      <tbody className='items-center text-center'>{tableItems}</tbody>
    </Table>
  )
}
