/* eslint-disable jsx-a11y/alt-text */
import Link from 'next/link'
import { ReactElement } from 'react'
import { SiGithub } from 'react-icons/si'

import { ActionIcon, AppShell, Footer, Group, Header, Image, Text } from '@mantine/core'

import { ActionToggle } from '@/components/ColorSchemeButton'
import { CurrentStatus } from '@/components/StatusBar'
import { GITHUB_URL } from '@/configs'

type LayoutProps = Required<{
  readonly children: ReactElement
}>

export const LayoutHeader = () => {
  return (
    <Header
      height={{ base: 50 }}
      className='flex justify-between items-center px-4'
      sx={(theme) => ({
        color: theme.colorScheme === 'dark' ? theme.colors.yellow[3] : theme.colors.yellow[7],
      })}
    >
      <Link href='/' className='text-inherit no-underline'>
        <Group>
          <ActionIcon size='md' variant='transparent' disabled>
            <Image src='https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa99.png' />
          </ActionIcon>
          <Text className='text-2xl font-bold'>毎期のコイン</Text>
        </Group>
      </Link>
      <ActionToggle />
    </Header>
  )
}

export const LayoutCurrentSeasonFooter = () => {
  return (
    <Footer height={50} p='xs' className='flex justify-center'>
      <CurrentStatus />
    </Footer>
  )
}

export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <AppShell header={<LayoutHeader />}>{children}</AppShell>
      <Text
        component='a'
        target='_blank'
        href={GITHUB_URL}
        className='flex sticky justify-center underline items-center gap-2'
      >
        <SiGithub />
        Github
      </Text>
    </div>
  )
}
