import type { FC } from 'react'

import { ScrollView } from 'react-native'

import { PlayListBlock, usePlayAllSong } from '@/components/play-list-block'

import { tw } from '@/utils'

interface Props {
  data: any[]
}

const Reommend: FC<Props> = (props) => {
  const { data } = props

  const play = usePlayAllSong()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`px-5`}
    >
      {data.map((item, i) => (
        <PlayListBlock
          key={`reommend_song_list-${i}`}
          showPlayIcon
          imageUrl={item.uiElement.image.imageUrl}
          name={item.uiElement.mainTitle.title}
          id={item.creativeId}
          size={tw`w-28`.width as number}
          play={() => play(item.creativeId)}
          style={[
            tw`w-28`,
            i !== 0 && i !== data.length - 1 && tw`mx-1`,
            i === 0 && tw`mr-1`,
            i === data.length - 1 && tw`ml-1`
          ]}
        />
      ))}
    </ScrollView>
  )
}

export default Reommend
