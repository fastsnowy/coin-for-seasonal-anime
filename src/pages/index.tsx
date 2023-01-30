import { GetStaticProps, NextPage } from 'next'
import { AppShell, Container, SimpleGrid, Stack, Title } from '@mantine/core'
import type { annictWorks } from '@/types/annict'
import { GET_ANIME_DETAILS } from '@/gql'
import { headers, ANNICT_URL } from '@/libs/annict'
import { AnimeCard } from '@/components/AnimeCard'
import { Layout } from '@/layouts'
import { ReactElement } from 'react'

type searchWorksProps = {
  searchWorks: annictWorks
}

export default function Home({ searchWorks }: searchWorksProps) {
  return (
    <>
      <Stack align='center' justify='center'>
        <Title order={1} className='underline text-red-300 p-3 px-2'>
          テスト表示
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

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch(ANNICT_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(GET_ANIME_DETAILS),
  })
  const data = await response.json()
  console.log(data.data.searchWorks)
  return {
    props: { searchWorks: data.data.searchWorks },
    revalidate: 60,
  }
}
