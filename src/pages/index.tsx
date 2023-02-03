import Link from 'next/link'

import { Button, Stack, Title } from '@mantine/core'

import { getSeasons } from '@/utils/getseason'

export default function Season() {
  const season = getSeasons()
  return (
    <>
      <Stack align='center' justify='center'>
        <Title order={1} className='underline text-red-300 p-3 px-2'>
          テスト表示
        </Title>
        <Link href='/seasons/current'>
          <Button>今期({season.current})</Button>
        </Link>
        <Link href='/seasons/next'>
          <Button>来期({season.next})</Button>
        </Link>
      </Stack>
    </>
  )
}
