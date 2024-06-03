import Link from "next/link";
import type { ReactElement } from "react";
import { TiLightbulb, TiWarningOutline } from "react-icons/ti";

import {
  Alert,
  Button,
  Container,
  Group,
  SimpleGrid,
  Text,
} from "@mantine/core";

import { TWITTER_URL } from "@/configs";
import { Layout } from "@/layouts";
import { getCurrentNextSeasons } from "@/utils/getseason";

export default function Home() {
  const season = getCurrentNextSeasons();
  return (
    <>
      <Container p="md" size="md">
        <SimpleGrid cols={1} spacing="xs">
          <Text align="center" size="xl">
            アニメに対する期待度を「コイン」を賭けて表そう！
          </Text>
          <Group position="center" p="md">
            <Link href={`/seasons/${season.current}`}>
              <Button variant="light" color="cyan" size="lg">
                今期(
                {season.current
                  .replace("winter", "冬")
                  .replace("spring", "春")
                  .replace("summer", "夏")
                  .replace("autumn", "秋")}
                )に賭ける
              </Button>
            </Link>
            <Link href={`/seasons/${season.next}`}>
              <Button variant="light" color="cyan" size="lg">
                来期(
                {season.next
                  .replace("winter", "冬")
                  .replace("spring", "春")
                  .replace("summer", "夏")
                  .replace("autumn", "秋")}
                )に賭ける
              </Button>
            </Link>
            <Link href={"/seasons/"}>
              <Button variant="light" color="cyan" size="lg">
                過去のアニメはこちら
              </Button>
            </Link>
          </Group>

          <Alert title="使い方" color="cyan" icon={<TiLightbulb />}>
            <Text>気になるアニメに「コイン」を賭ける</Text>
            <Text>結果をツイートしシェア</Text>
          </Alert>
          <Alert
            title="注意"
            color="red"
            icon={<TiWarningOutline />}
            className="grow-0"
          >
            <Text>
              作った人→
              <Text
                component="a"
                target="_blank"
                href={TWITTER_URL}
                className="underline"
              >
                Twitter
              </Text>
            </Text>
            <Text>
              このサイトは
              <Text
                component="a"
                target="_blank"
                href="https://developers.annict.com"
                className="underline"
              >
                Annict GraphQL API
              </Text>
              を用いて各シーズンのアニメの情報を取得しています。
            </Text>
            <Text>
              ※
              このサイトはネタサイトです。ここで言う「コイン」とは一般名称であり、実際の金融通貨等と一切関係ありません。
            </Text>
          </Alert>
        </SimpleGrid>
      </Container>
    </>
  );
}

Home.getLayout = function getLayout(pages: ReactElement) {
  return <Layout>{pages}</Layout>;
};
