import { NextPage } from 'next'
import { Stack, Title } from '@mantine/core'
const Home: NextPage = () => {
  return (
    <Stack align='center' justify='center'>
      <Title order={1} className='underline text-red-300 p-3 px-2'>
        Mantine + TailwindCSS
      </Title>
    </Stack>
  )
}

export default Home
