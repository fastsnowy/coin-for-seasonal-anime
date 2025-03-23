/* eslint-disable jsx-a11y/alt-text */
import { FaTwitter } from "react-icons/fa";
import { TbLetterA } from "react-icons/tb";
import { useRecoilState } from "recoil";

import {
  ActionIcon,
  AspectRatio,
  Badge,
  Card,
  Flex,
  Group,
  Image,
  Text,
  Tooltip,
} from "@mantine/core";

import { AtomFamilyTotalCoinValue } from "@/global/atoms";
import type { nodes } from "@/types/annict";
import type { betAnimes } from "@/types/coins";

type resultCardProps = {
  work: nodes;
  betAnimes: betAnimes;
  totalCoins: { annict_id: number; total_coin_value: number }[];
};

export function ResultCard({ work, betAnimes, totalCoins }: resultCardProps) {
  // annictIdごとのcoin_valueの合計を取得
  const [totalCoinValue, setTotalCoinValue] = useRecoilState(
    AtomFamilyTotalCoinValue(work.annictId),
  );
  totalCoins.map((item) => {
    if (item.annict_id === work.annictId) {
      setTotalCoinValue(item.total_coin_value);
    }
  });
  // work.annictIdとbetAnimes.annict_idが一致する時のcoin_valueを取得
  const coinValueList = betAnimes.map((item) => {
    if (item.annict_id === work.annictId) {
      return item.coin_value;
    }
  });
  const idx = coinValueList.findIndex((item) => item !== undefined);

  return (
    <Card shadow="md" radius="md" p="lg" key={work.annictId}>
      <Card.Section component="a" target="_blank" href={work.officialSiteUrl}>
        <AspectRatio ratio={16 / 9}>
          {work.image?.recommendedImageUrl ? (
            <Image
              src={work.image?.recommendedImageUrl}
              withPlaceholder
              className="transform duration-300 hover:scale-110"
            />
          ) : (
            <Image
              src={work.image?.facebookOgImageUrl}
              withPlaceholder
              className="transform duration-300 hover:scale-110"
            />
          )}
        </AspectRatio>
      </Card.Section>
      <Card.Section px="xs" className="text-center">
        <Flex className="justify-between items-center text-center">
          <Group>
            <Badge color="gray" radius={0}>
              {work.media}
            </Badge>
            <Tooltip label="Twitter">
              <ActionIcon
                component="a"
                target="_blank"
                href={`https://twitter.com/${work.twitterUsername}`}
                className=""
              >
                <FaTwitter />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Annict">
              <ActionIcon
                component="a"
                target="_blank"
                href={`https://annict.com/works/${work.annictId}`}
              >
                <TbLetterA />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Tooltip label="視聴者数">
            <Text align="center">
              {work.watchersCount.toLocaleString()} watchers
            </Text>
          </Tooltip>
        </Flex>
      </Card.Section>
      <Card.Section px="xs">
        <Flex className="justify-end text-right">
          <Tooltip label="コイン総数">
            <Text>{totalCoinValue.toLocaleString()} coins</Text>
          </Tooltip>
        </Flex>
      </Card.Section>
      <Card.Section px="xs">
        <Text px="md" className="font-medium text-center justify-center">
          {work.title}
        </Text>
      </Card.Section>
      <Card.Section py="xs">
        <Group position="center">
          <ActionIcon size="xs" variant="transparent" disabled>
            <Image src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa99.png" />
          </ActionIcon>
          <Text size="lg" align="center">
            {coinValueList[idx]?.toLocaleString()}
          </Text>
        </Group>
      </Card.Section>
    </Card>
  );
}
