import Head from "next/head";

import { DEPLOY_URL } from "@/configs";

export function SEO({
  title,
  currentUrl,
}: { title: string; currentUrl: string }) {
  return (
    <Head>
      <title>{title} | coin for seasonal anime</title>
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        property="og:title"
        content={`${title} | coin for seasonal anime`}
      />
      <meta property="og:url" content={`https://${DEPLOY_URL}/${currentUrl}`} />
      <meta property="og:site_name" content={"coin for seasonal anime"} />
      <meta
        property="og:description"
        content="アニメに対する期待度を「コイン」を賭けて表そう"
      />
    </Head>
  );
}
