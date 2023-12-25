import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { ReactElement } from 'react'
import { FaTwitter } from 'react-icons/fa'
import { TbPhoto, TbTable } from 'react-icons/tb'

import {
  ActionIcon,
  Button,
  Container,
  Group,
  Image,
  Mark,
  SimpleGrid,
  Table,
  Tabs,
  Text,
  Tooltip,
} from '@mantine/core'

import { TwitterIntentTweet } from '@/components/TwitterShare'
import { ResultCard } from '@/components/results/ResultsCard'
import { ResultsTable } from '@/components/results/ResultsTable'
import { BET_COINS, DEPLOY_URL, TOTAL_COIN_VALUE_VIEW } from '@/configs'
import { GET_ANIME_DETAILS_BY_IDS } from '@/gql'
import { Layout } from '@/layouts'
import { ANNICT_URL, headers } from '@/libs/annict'
import { supabase } from '@/libs/supabaseClient'
import { annictWorks } from '@/types/annict'
import { betAnimes } from '@/types/coins'

type resultProps = {
  seasonName: string
  resultId: string
  betAnimes: betAnimes
  totalCoins: { annict_id: number; total_coin_value: number }[]
  searchWorks: annictWorks
}

export default function Result({
  seasonName,
  resultId,
  betAnimes,
  totalCoins,
  searchWorks,
}: resultProps) {
  // betAnimesのcoin_value合計を計算
  const totalCoinValueSum = betAnimes.reduce((sum, current) => {
    return sum + current.coin_value
  }, 0)
  const seasonsText = seasonName
    .replace('winter', '冬')
    .replace('spring', '春')
    .replace('summer', '夏')
    .replace('autumn', '秋')
  const shareText = `${seasonsText}アニメに合計${totalCoinValueSum}枚のコインを賭けました！`
  const card = searchWorks.nodes.map((work) => (
    <ResultCard work={work} betAnimes={betAnimes} totalCoins={totalCoins} key={work.annictId} />
  ))
  const tableItems = searchWorks.nodes.map((work) => (
    <ResultsTable work={work} betAnimes={betAnimes} totalCoins={totalCoins} key={work.annictId} />
  ))
  const table = (
    <Table fontSize='md' verticalSpacing='md'>
      <thead>
        <tr>
          <th>
            <Text align='center'>作品名</Text>
          </th>
          <th>
            <Text align='center'>コイン数</Text>
          </th>
        </tr>
      </thead>
      <tbody className='items-center text-center'>{tableItems}</tbody>
    </Table>
  )
  return (
    <Container size='xl' p='md'>
      <Text align='center' className='text-lg'>
        {seasonsText}アニメに
      </Text>
      <Group position='center' className='text-lg'>
        <ActionIcon size='sm' variant='transparent' disabled>
          <Image
            src='https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa99.png'
            alt='coin-icon'
          />
        </ActionIcon>
        <Mark>{totalCoinValueSum.toLocaleString()}枚</Mark>
        のコインを賭けました！
      </Group>
      <Tabs defaultValue='card'>
        <Tabs.List position='right'>
          <Tooltip label='カード'>
            <Tabs.Tab value='card' icon={<TbPhoto size={14} />}></Tabs.Tab>
          </Tooltip>
          <Tooltip label='テーブル'>
            <Tabs.Tab value='table' icon={<TbTable size={14} />}></Tabs.Tab>
          </Tooltip>
        </Tabs.List>
        <Tabs.Panel value='card'>
          <SimpleGrid
            cols={3}
            breakpoints={[
              { maxWidth: 'md', cols: 2 },
              { maxWidth: 'xs', cols: 1 },
            ]}
            p='sm'
          >
            {card}
          </SimpleGrid>
        </Tabs.Panel>
        <Tabs.Panel value='table'>{table}</Tabs.Panel>
      </Tabs>
      <Group position='center' className='flex justify-center'>
        <Button
          component={TwitterIntentTweet}
          text={shareText}
          url={`https://${DEPLOY_URL}/results?id=${resultId}`}
          color='blue'
          leftIcon={<FaTwitter />}
        >
          ツイート
        </Button>
        <Link href={`/seasons/${seasonName}`}>
          <Button variant='default'>{seasonsText}アニメ一覧へ</Button>
        </Link>
        <Link href='/'>
          <Button variant='default'>トップに戻る</Button>
        </Link>
      </Group>
    </Container>
  )
}

export const getServerSideProps = async ({
  query,
  res,
}: GetServerSidePropsContext<{ results: string }>) => {
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600')
  const resultId = query.id
  const { data: betAnimes, error } = await supabase
    .from(BET_COINS)
    .select('annict_id, coin_value, season')
    .eq('created_id', resultId)
  if (error) {
    console.log(error)
    throw error
  }
  if (betAnimes) {
    const seasonName = betAnimes[0].season as string
    const annictIds = betAnimes.map((res) => res.annict_id)
    const { data: totalCoins, error } = await supabase
      .from(TOTAL_COIN_VALUE_VIEW)
      .select('annict_id, total_coin_value')
      .eq('season', seasonName)
    if (error) {
      console.log(error)
      throw error
    }
    const annictResponse = await fetch(ANNICT_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(GET_ANIME_DETAILS_BY_IDS(annictIds as number[])),
    })
    if (!annictResponse.ok) {
      const error = new Error(`${annictResponse.status} data fetching error`)
      throw error
    }
    const annictData = await annictResponse.json()
    return {
      props: {
        seasonName: seasonName,
        resultId: resultId,
        betAnimes: betAnimes,
        totalCoins: totalCoins,
        searchWorks: annictData.data.searchWorks,
      },
    }
  }
}

Result.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
