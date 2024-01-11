import type { FC } from 'react'

import { ScrollView, Text } from 'react-native'

import { PlayListBlock, usePlayAllSong } from '@/components/play-list-block'

import { tw } from '@/utils'

interface Props {
  data: any[]
}

const RadarSongList: FC<Props> = (props) => {
  const { data } = props

  const play = usePlayAllSong()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`px-5`}
    >
      {data.map((item, i) => {
        const renderExtra = () => (
          <Text
            style={tw`text-xs text-gray-400`}
            numberOfLines={1}
          >
            7.6k+ fov
          </Text>
        )
        
        return (
          <PlayListBlock
            key={`ld_i${i}`}
            showPlayIcon
            showHardShadow
            imageUrl={item.uiElement?.image.imageUrl}
            name={item.uiElement?.mainTitle.title}
            id={item.creativeId}
            play={() => play(item.creativeId)}
            style={[
              tw`flex-col justify-center items-center`,
              i !== 0 && i !== data.length - 1 && tw`mx-1`,
              i === 0 && tw`mr-1`,
              i === data.length - 1 && tw`ml-1`
            ]}
            renderExtra={renderExtra}
          />
        )
      })}
    </ScrollView>
  )
}

export default RadarSongList
