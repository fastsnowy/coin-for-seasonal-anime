import Document, { Head, Html, Main, NextScript } from 'next/document'

import { createGetInitialProps } from '@mantine/next'

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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
