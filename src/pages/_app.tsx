import { Analytics } from '@vercel/analytics/react'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'
import { RecoilRoot } from 'recoil'

import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import '@/styles/globals.css'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'
import { NotificationsProvider } from '@mantine/notifications'

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
  colorScheme: ColorScheme
}

export default function App(props: AppPropsWithLayout) {
  const { Component, pageProps } = props
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  useHotkeys([['mod+J', () => toggleColorScheme()]])

  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <>
      <Head>
        <title>coin for seasonal anime</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
      </Head>
      <RecoilRoot>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme,
            }}
          >
            <NotificationsProvider autoClose={3000}>
              {getLayout(<Component {...pageProps} />)}
              <Analytics />
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </RecoilRoot>
    </>
  )
}
