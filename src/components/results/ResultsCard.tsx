/* eslint-disable jsx-a11y/alt-text */
import { FaTwitter } from 'react-icons/fa'
import { TbLetterA } from 'react-icons/tb'
import { useRecoilValue } from 'recoil'

import {
  ActionIcon,
  AspectRatio,
  Badge,
  Card,
  Container,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Text,
  Tooltip,
} from '@mantine/core'

import { selectorGetBetAnimeListCurrentSeason } from '@/global/selectors'

export function ResultCurrentCard() {
  const { betAnimeList, coinValueList } = useRecoilValue(selectorGetBetAnimeListCurrentSeason)
  const cards = betAnimeList.map((work, idx) => (
    <Card shadow='md' radius='md' p='lg' key={work.annictId}>
      <Card.Section component='a' target='_blank' href={work.officialSiteUrl}>
        <AspectRatio ratio={16 / 9}>
          <Image
            src={
              work.image.recommendedImageUrl
                ? work.image.recommendedImageUrl
                : work.image.facebookOgImageUrl
            }
            withPlaceholder
            className='transform duration-300 hover:scale-110'
          />
        </AspectRatio>
      </Card.Section>
      <Card.Section px='xs' className='text-center'>
        <Flex className='justify-between items-center text-center'>
          <Group>
            <Badge color='gray' radius={0}>
              {work.media}
            </Badge>
            <Tooltip label='Twitter'>
              <ActionIcon
                component='a'
                target='_blank'
                href={`https://twitter.com/${work.twitterUsername}`}
                className=''
              >
                <FaTwitter />
              </ActionIcon>
            </Tooltip>
            <Tooltip label='Annict'>
              <ActionIcon
                component='a'
                target='_blank'
                href={`https://annict.com/works/${work.annictId}`}
              >
                <TbLetterA />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Tooltip label='視聴者数'>
            <Text align='center'>{work.watchersCount} watchers</Text>
          </Tooltip>
        </Flex>
        <Text px='md' className='font-medium text-center justify-center'>
          {work.title}
        </Text>
      </Card.Section>
      <Card.Section py='xs'>
        <Text size='lg' align='center'>
          🪙{coinValueList[idx]}
        </Text>
      </Card.Section>
    </Card>
  ))
  return (
    <Container size='xl'>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'sm', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        {cards}
      </SimpleGrid>
    </Container>
  )
}
