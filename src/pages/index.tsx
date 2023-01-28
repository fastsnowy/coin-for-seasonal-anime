import { GetStaticProps, NextPage } from 'next'
import { Container, SimpleGrid, Stack, Title } from '@mantine/core'
import type { annictWorks } from '@/types/annict'
import { GET_ANIME_DETAILS } from '@/gql'
import { headers, ANNICT_URL } from '@/libs/annict'
import { AnimeCard } from '@/components/AnimeCard'

type searchWorksProps = {
  searchWorks: annictWorks
}

const Home = ({ searchWorks }: searchWorksProps) => {
  return (
    <>
      <Stack align='center' justify='center'>
        <Title order={1} className='underline text-red-300 p-3 px-2'>
          テスト表示
        </Title>
      </Stack>
      <Container size='xl'>
        <SimpleGrid cols={3}>
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

export default Home

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
