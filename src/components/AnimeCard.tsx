import {
  Card,
  Title,
  Image,
  Text,
  AspectRatio,
  Slider,
  Badge,
  Group,
  ActionIcon,
  Flex,
} from '@mantine/core'
import { nodes } from '@/types/annict'
import { FaTwitter } from 'react-icons/fa'
import { useRecoilState } from 'recoil'
import { betCoinValueAtomFamily } from '@/global'

type workProps = {
  work: nodes
}

export function AnimeCard({ work }: workProps) {
  const [betValue, setBetValue] = useRecoilState(betCoinValueAtomFamily(work.annictId))
  return (
    <Card shadow='md' radius='md' p='lg' key={work.annictId}>
      {work.image?.recommendedImageUrl ? (
        <Card.Section component='a' target='_blank' href={work.officialSiteUrl}>
          <AspectRatio ratio={16 / 9}>
            <Image
              src={work.image?.recommendedImageUrl}
              className='transform duration-300 hover:scale-110'
              withPlaceholder
            />
          </AspectRatio>
        </Card.Section>
      ) : (
        <Card.Section component='a' target='_blank' href={work.officialSiteUrl}>
          <AspectRatio ratio={16 / 9}>
            <Image
              src={work.image?.facebookOgImageUrl}
              className='transform duration-300 hover:scale-110'
              withPlaceholder
            />
          </AspectRatio>
        </Card.Section>
      )}
      <Card.Section px='xs'>
        <Flex className='justify-between items-center text-center'>
          <Group>
            <Badge color='gray' radius={0}>
              {work.media}
            </Badge>
            <ActionIcon
              component='a'
              target='_blank'
              href={`https://twitter.com/${work.twitterUsername}`}
              className=''
            >
              <FaTwitter />
            </ActionIcon>
          </Group>
          <Text align='center'>{work.watchersCount} watchers</Text>
        </Flex>
        <Text px='md' className='font-medium text-center justify-center'>
          {work.title}
        </Text>
      </Card.Section>
      <Card.Section p='xs'>
        <Group position='center'>
          <Text size='lg'>🪙{betValue}</Text>
        </Group>
        <Slider
          step={10}
          px='lg'
          py='md'
          color='cyan'
          value={betValue}
          onChange={(val) => setBetValue(val)}
        />
      </Card.Section>
    </Card>
  )
}
