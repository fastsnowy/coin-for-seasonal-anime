import { AppShell, Badge, Flex, Footer, Group, Header, MediaQuery, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { ReactElement } from 'react'

type LayoutProps = Required<{
  readonly children: ReactElement
}>

export const LayoutHeader = () => {
  return (
    <Header height={{ base: 40, md: 50 }} className='flex px-4'>
      <Flex className='justify-between items-center text-center'>
        <Text>サイトタイトル</Text>
      </Flex>
    </Header>
  )
}

export const LayoutFooter = () => {
  return (
    <Footer height={50} p='md'>
      <Flex className='justify-between items-center text-center'>
        <Text>フッター</Text>
      </Flex>
    </Footer>
  )
}

export function Layout({ children }: LayoutProps) {
  return (
    <AppShell
      header={<LayoutHeader />}
      footer={
        <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
          <Group>
            <LayoutFooter />
          </Group>
        </MediaQuery>
      }
    >
      {children}
    </AppShell>
  )
}
