import Head from 'next/head'

import { DEPLOY_URL } from '@/configs'

// propsの設定

export default function SEO({ title }: { title: string }) {
  return (
    <Head>
      <title>{title} | coin for seasonal anime</title>
      <meta name='twitter:card' content='summary_large_image' />
      <meta property='og:title' content='coin for seasonal anime' />
      <meta property='og:site_name' content='coin for seasonal anime' />
      <meta property='og:description' content='アニメに対する期待度を「コイン」を賭けて表そう' />
      <meta property='og:image' content={`https://${DEPLOY_URL}/api/og?title=${title}`} />
    </Head>
  )
}
