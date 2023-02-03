import { GetStaticProps } from 'next'
import { ReactElement } from 'react'
import { useSetRecoilState } from 'recoil'

import { AppShell, Container, SimpleGrid, Stack, Title } from '@mantine/core'

import type { annictWorks } from '@/types/annict'

import { AnimeCard } from '@/components/AnimeCard'
import { AtomFetchNextSeason } from '@/global/atoms'
import { GET_ANIME_DETAILS } from '@/gql'
import { LayoutHeader, LayoutNextSeasonFooter } from '@/layouts'
import { headers, ANNICT_URL } from '@/libs/annict'
import { getSeasons } from '@/utils/getseason'

type searchWorksProps = {
  searchWorks: annictWorks
}

const seasons = getSeasons().next
export default function NextSeason({ searchWorks }: searchWorksProps) {
  const setSearchWorks = useSetRecoilState(AtomFetchNextSeason)
  setSearchWorks(searchWorks)
  return (
    <>
      <Stack align='center' justify='center'>
        <Title order={1} className='underline text-red-300 p-3 px-2'>
          表示: {seasons}
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
    </>
  )
}

NextSeason.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppShell header={<LayoutHeader />} footer={<LayoutNextSeasonFooter />}>
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
    revalidate: 60 * 60,
  }
}
