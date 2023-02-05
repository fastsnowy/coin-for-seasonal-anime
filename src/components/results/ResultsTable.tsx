import { useRecoilValue } from 'recoil'

import { Flex, Paper, Progress, Table, Text, Tooltip } from '@mantine/core'

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
        <Paper
          component='a'
          target='_blank'
          href={work.officialSiteUrl}
          sx={(theme) => ({
            backgroundImage: work.image?.recommendedImageUrl
              ? `url(${work.image?.recommendedImageUrl})`
              : `url(${work.image?.facebookOgImageUrl})`,
            backgroundColor: 'rgba(30,30,30,0.6)',
            backgroundBlendMode: 'darken',
            height: 90,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[0],
          })}
        >
          <Flex align='end' justify='flex-end' px='md'>
            <Tooltip label='視聴者数'>
              <Text>{work.watchersCount.toLocaleString()} watchers</Text>
            </Tooltip>
          </Flex>
          <Text align='center' size='lg' weight='bold' className='items-center text-center'>
            {betAnimeList[idx].title}
          </Text>
        </Paper>
      </td>
      <td>
        <Text>🪙{coinValueList[idx].toLocaleString()}</Text>
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
        <Paper
          component='a'
          target='_blank'
          href={work.officialSiteUrl}
          sx={(theme) => ({
            backgroundImage: work.image?.recommendedImageUrl
              ? `url(${work.image?.recommendedImageUrl})`
              : `url(${work.image?.facebookOgImageUrl})`,
            backgroundColor: 'rgba(30,30,30,0.6)',
            backgroundBlendMode: 'darken',
            height: 90,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[0],
          })}
        >
          <Flex align='end' justify='flex-end' px='md'>
            <Tooltip label='視聴者数'>
              <Text>{work.watchersCount.toLocaleString()} watchers</Text>
            </Tooltip>
          </Flex>
          <Text align='center' size='lg' weight='bold' className='items-center text-center'>
            {betAnimeList[idx].title}
          </Text>
        </Paper>
      </td>
      <td>
        <Text>🪙{coinValueList[idx].toLocaleString()}</Text>
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
      <tbody className='items-center text-center'>{tableItems}</tbody>
    </Table>
  )
}
