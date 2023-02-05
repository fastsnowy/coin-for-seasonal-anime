/* eslint-disable jsx-a11y/alt-text */
import { memo } from 'react'
import { FaTwitter } from 'react-icons/fa'
import { TbLetterA } from 'react-icons/tb'
import { useRecoilState } from 'recoil'

import {
  Card,
  Image,
  Text,
  AspectRatio,
  Slider,
  Badge,
  Group,
  ActionIcon,
  Flex,
  Tooltip,
  Container,
  NumberInput,
} from '@mantine/core'

import { AtomFamilybetCoinValue } from '@/global/atoms'
import { nodes } from '@/types/annict'

type workProps = {
  work: nodes
}

const SliderCoin = ({ work }: workProps) => {
  const [betValue, setBetValue] = useRecoilState(AtomFamilybetCoinValue(work.annictId))

  return (
    <div>
      <Group position='center'>
        <NumberInput
          hideControls
          defaultValue={0}
          min={0}
          value={betValue}
          icon='🪙'
          onChange={(val) => {
            if (val != null) {
              setBetValue(val)
            }
          }}
          styles={{ input: { width: 120, textAlign: 'center' } }}
        />
      </Group>
      <Container size='xs'>
        <Slider
          step={10}
          px='xl'
          py='md'
          color='cyan'
          value={betValue}
          onChange={(val) => {
            setBetValue(val)
          }}
        />
      </Container>
    </div>
  )
}
const MemoSiliderCoin = memo(SliderCoin)

export function AnimeCard({ work }: workProps) {
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
      <Card.Section p='xs'>
        <MemoSiliderCoin work={work} />
      </Card.Section>
    </Card>
  )
}
