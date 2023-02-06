import Link from 'next/link'
import { ReactElement } from 'react'
import { TiLightbulb, TiWarningOutline } from 'react-icons/ti'

import { Alert, Button, Container, Group, SimpleGrid, Text } from '@mantine/core'

import { Layout } from '@/layouts'
import { getSeasons } from '@/utils/getseason'

export default function Home() {
  const season = getSeasons()
  return (
    <>
      <Container p='md' size='md'>
        <SimpleGrid cols={1} spacing='xs'>
          <Text align='center' size='xl'>
            アニメに対する期待度を「アニメコイン」を賭けて表そう！
          </Text>
          <Group position='center' p='md'>
            <Link href='/seasons/current'>
              <Button variant='outline'>
                今期(
                {season.current
                  .replace('winter', '冬')
                  .replace('spring', '春')
                  .replace('summer', '夏')
                  .replace('autumn', '秋')}
                )に賭ける
              </Button>
            </Link>
            <Link href='/seasons/next'>
              <Button variant='outline'>
                来期(
                {season.next
                  .replace('winter', '冬')
                  .replace('spring', '春')
                  .replace('summer', '夏')
                  .replace('autumn', '秋')}
                )に賭ける
              </Button>
            </Link>
          </Group>

          <Alert title='about' icon={<TiLightbulb />}>
            <Text>
              このサイトは
              <Text
                component='a'
                target='_blank'
                href='https://developers.annict.com'
                className='underline'
              >
                Annict GraphQL API
              </Text>
              を用いてアニメの情報を取得しています。
            </Text>
          </Alert>
          <Alert title='注意' color='red' icon={<TiWarningOutline />} className='grow-0'>
            <Text>
              このサイトはネタサイトです。「アニメコイン」は実際の金融通貨等と一切関係ありません。
            </Text>
          </Alert>
        </SimpleGrid>
      </Container>
    </>
  )
}

Home.getLayout = function getLayout(pages: ReactElement) {
  return <Layout>{pages}</Layout>
}
