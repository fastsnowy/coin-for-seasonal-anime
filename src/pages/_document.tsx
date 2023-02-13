import Document, { Head, Html, Main, NextScript } from 'next/document'

import { createGetInitialProps } from '@mantine/next'

import { DEPLOY_URL } from '@/configs'

const getInitialProps = createGetInitialProps()

export default class _Document extends Document {
  static getInitialProps = getInitialProps

  render() {
    return (
      <Html lang='ja'>
        <Head>
          <link
            rel='icon'
            href='https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa99.png'
          />
          <meta name='twitter:card' content='summary' />
          <meta property='og:title' content='毎期のコイン' />
          <meta property='og:site_name' content='coin for seasonal anime' />
          <meta property='og:url' content={DEPLOY_URL} />
          <meta
            property='og:description'
            content='アニメに対する期待度を「コイン」を賭けて表そう!'
          />
          <meta property='og:image' content={`${DEPLOY_URL}/api/og`} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
