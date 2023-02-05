import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { ReactElement } from 'react'
import { useSetRecoilState } from 'recoil'

import { AppShell, Box, Container, SimpleGrid, Stack, Title } from '@mantine/core'

import type { annictWorks } from '@/types/annict'

import { AnimeCard } from '@/components/AnimeCard'
import { ResultCurrentModal } from '@/components/results/ResultsModal'
import { AtomFetchCurrentSeason, AtomIsCurrentModalOpened } from '@/global/atoms'
import { GET_ANIME_DETAILS } from '@/gql'
import { LayoutHeader } from '@/layouts'
import { headers, ANNICT_URL } from '@/libs/annict'
import { getSeasons } from '@/utils/getseason'

const LayoutCurrentSeasonFooter = dynamic(
  () => import('@/layouts/').then((mod) => mod.LayoutCurrentSeasonFooter),
  { ssr: false },
)
type searchWorksProps = {
  searchWorks: annictWorks
}

const seasons = getSeasons().current
export default function Season({ searchWorks }: searchWorksProps) {
  const setSearchWorks = useSetRecoilState(AtomFetchCurrentSeason)
  const setModalOpened = useSetRecoilState(AtomIsCurrentModalOpened)
  setModalOpened(false)
  setSearchWorks(searchWorks)
  return (
    <>
      <Box
        sx={(theme) => ({
          color: theme.colorScheme === 'dark' ? theme.colors.gray[3] : theme.colors.gray[7],
        })}
      >
        <ResultCurrentModal />
        <Stack align='center' justify='center'>
          <Title order={1} className=' p-3 px-2'>
            {seasons
              .replace('winter', '冬')
              .replace('spring', '春')
              .replace('summer', '夏')
              .replace('autumn', '秋')}
            アニメ一覧
          </Title>
        </Stack>
        <Container size='xl'>
          <SimpleGrid
            cols={3}
            breakpoints={[
              { maxWidth: 'sm', cols: 2 },
              { maxWidth: 'xs', cols: 1 },
            ]}
          >
            {searchWorks.nodes.map((work) => (
              <div key={work.annictId}>
                <AnimeCard work={work} />
              </div>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </>
  )
}

Season.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppShell header={<LayoutHeader />} footer={<LayoutCurrentSeasonFooter />}>
      {page}
    </AppShell>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch(ANNICT_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(GET_ANIME_DETAILS(seasons)),
  })
  const data = await response.json()

  return {
    props: { searchWorks: data.data.searchWorks },
    revalidate: 60 * 15,
  }
}
