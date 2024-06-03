import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import { useSetRecoilState } from "recoil";

import {
  AppShell,
  Box,
  Container,
  SimpleGrid,
  Stack,
  Title,
} from "@mantine/core";

import type { annictWorks } from "@/types/annict";

import { AnimeCard } from "@/components/AnimeCard";
import { SEO } from "@/components/BaseHead";
import { ConfirmModal } from "@/components/ConfirmModal";
import { TOTAL_COIN_VALUE_VIEW } from "@/configs";
import {
  AtomFetchCurrentSeason,
  AtomIsCurrentModalOpened,
} from "@/global/atoms";
import { GET_ANIME_DETAILS } from "@/gql";
import { LayoutHeader } from "@/layouts";
import { ANNICT_URL, headers } from "@/libs/annict";
import { supabase } from "@/libs/supabaseClient";
import { getSeasons } from "@/utils/getseason";
import { replaceSeasonName } from "@/utils/replaceSeason";

const LayoutCurrentSeasonFooter = dynamic(
  () => import("@/layouts/").then((mod) => mod.LayoutCurrentSeasonFooter),
  { ssr: false },
);
type searchWorksProps = {
  searchWorks: annictWorks;
  seasonName: string;
  totalCoin: { annict_id: number; total_coin_value: number }[];
};

export default function Season({
  searchWorks,
  seasonName,
  totalCoin,
}: searchWorksProps) {
  const setSearchWorks = useSetRecoilState(AtomFetchCurrentSeason);
  const setModalOpened = useSetRecoilState(AtomIsCurrentModalOpened);
  setModalOpened(false);
  setSearchWorks(searchWorks);
  const replacedSeasonName = replaceSeasonName(seasonName);
  return (
    <>
      <SEO
        title={`${replacedSeasonName}アニメ一覧`}
        currentUrl={`seasons/${seasonName}`}
      />
      <Box
        sx={(theme) => ({
          color:
            theme.colorScheme === "dark"
              ? theme.colors.gray[3]
              : theme.colors.gray[7],
        })}
      >
        <ConfirmModal seasonName={seasonName} />
        <Stack align="center" justify="center">
          <Title order={2} className=" p-3 px-2">
            {replacedSeasonName}
            アニメ一覧
          </Title>
        </Stack>
        <Container size="xl">
          <SimpleGrid
            cols={3}
            breakpoints={[
              { maxWidth: "md", cols: 2 },
              { maxWidth: "xs", cols: 1 },
            ]}
          >
            {searchWorks.nodes.map((work) => (
              <div key={work.annictId}>
                <AnimeCard work={work} totalCoin={totalCoin} />
              </div>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}

Season.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppShell header={<LayoutHeader />} footer={<LayoutCurrentSeasonFooter />}>
      {page}
    </AppShell>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getSeasons().map((season) => ({
    params: {
      seasons: season.seasons,
    },
  }));
  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const seasonName = context.params?.seasons;
  const response = await fetch(ANNICT_URL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(GET_ANIME_DETAILS(seasonName as string)),
  });
  if (!response.ok) {
    const error = new Error(`${response.status} data fetching error`);
    throw error;
  }
  const data = await response.json();
  // supabaseからデータを取得
  const { data: totalCoinValue, error } = await supabase
    .from(TOTAL_COIN_VALUE_VIEW)
    .select("annict_id, total_coin_value")
    .eq("season", seasonName);
  if (error) {
    console.log(error);
  }

  return {
    props: {
      searchWorks: data.data.searchWorks,
      seasonName: seasonName,
      totalCoin: totalCoinValue,
    },
    revalidate: 60 * 30,
  };
};
