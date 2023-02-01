import { Button, Flex, Group, SimpleGrid, Text, useMantineColorScheme } from '@mantine/core'
import { selector, selectorFamily, useRecoilValue } from 'recoil'
import { betCoinValueAtomFamily } from '@/global'

export function CurrentStatus() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const sumTotalBetState = selector({
    key: 'betCoinValue',
    get: ({ get }) => {
      const count = get(betCoinValueAtomFamily(9578))
      return count
    },
  })
  const status = useRecoilValue(sumTotalBetState)
  return (
    <Flex align='center' gap='lg' justify='center'>
      <Text>賭けたコイン</Text>
      <Text>🪙{status}枚</Text>
      <Button variant='light' color='cyan'>
        <Text>結果を表示</Text>
      </Button>
    </Flex>
  )
}
