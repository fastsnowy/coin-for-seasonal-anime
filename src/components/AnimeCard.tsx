import { Card, Image, Title, Text, AspectRatio } from '@mantine/core'
import { nodes } from '@/types/annict'

type workProps = {
  work: nodes
}
export function AnimeCard({ work }: workProps) {
  return (
    <Card
      shadow='md'
      radius='md'
      p='lg'
      className='transition ease-in-out delay-120 hover:-translate-y-1'
    >
      {work.image?.facebookOgImageUrl && (
        <Card.Section>
          <AspectRatio ratio={16 / 9}>
            <Image
              placeholder
              src={work.image?.facebookOgImageUrl}
              //   src={`https://placehold.jp/665266/ffffff/1600x900.png?text=${work.title}`}
            />
          </AspectRatio>
        </Card.Section>
      )}
      <Card.Section>
        <Text px='md' className='font-medium text-center justify-center'>
          {work.title}
        </Text>
      </Card.Section>
    </Card>
  )
}
