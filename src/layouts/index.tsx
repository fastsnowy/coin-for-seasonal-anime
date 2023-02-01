import {
  AppShell,
  Aside,
  Badge,
  Flex,
  Footer,
  Group,
  Header,
  MediaQuery,
  Text,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { ReactElement } from 'react'
import { CurrentStatus } from '@/components/CurrentStatus'
import { ActionToggle } from '@/components/ColorSchemeButton'
type LayoutProps = Required<{
  readonly children: ReactElement
}>

export const LayoutHeader = () => {
  return (
    <Header height={{ base: 40, md: 50 }} className='flex px-4'>
      <Flex className='justify-between items-center text-center'>
        <Text>サイトタイトル</Text>
        <ActionToggle />
      </Flex>
    </Header>
  )
}

export const LayoutFooter = () => {
  return (
    <Footer height={50} p='md' className='flex px-4 justify-center'>
      <CurrentStatus />
    </Footer>
  )
}

const LayoutAside = () => {
  return (
    <Aside width={{ lg: 200 }} hiddenBreakpoint='sm'>
      <CurrentStatus />
    </Aside>
  )
}

export function Layout({ children }: LayoutProps) {
  return (
    <AppShell header={<LayoutHeader />} footer={<LayoutFooter />}>
      {children}
    </AppShell>
  )
}
