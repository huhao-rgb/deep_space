import type { FC } from 'react'

import {
  ScrollView,
  View,
  Text
} from 'react-native'
import { Image } from 'expo-image'
import { RectButton } from 'react-native-gesture-handler'

import { tw } from '@/utils'

interface Props {
  data: any[]
}

const RadarSongList: FC<Props> = (props) => {
  const { data } = props

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`px-5`}
    >
      {data.map((item, i) => (
        <RectButton
          key={`ld_i${i}`}
          borderless={false}
          rippleColor={tw.color('red-50')}
          activeOpacity={0.8}
        >
          <View
            style={[
              tw`flex-col justify-center items-center`,
              i !== 0 && i !== data.length - 1 && tw`mx-1`,
              i === 0 && tw`mr-1`,
              i === data.length - 1 && tw`ml-1`
            ]}
          >
          <View style={tw`w-28 flex-col items-center relative`}>
            <Image
              source={{ uri: `${item.uiElement?.image.imageUrl}?param=300y300` }}
              style={tw`w-28 h-28 bg-gray-200 rounded-2xl`}
            />
            <View style={tw`w-22 h-2 rounded-b-lg bg-gray-100`} />
          </View>
          <Text
            style={tw`mt-1 w-28 text-xs text-gray-800 text-center`}
            numberOfLines={2}
          >
            {item.uiElement?.mainTitle.title}
          </Text>
          <Text
            style={tw`text-xs text-gray-400`}
            numberOfLines={1}
          >
            7.6k+ fov
          </Text>
        </View>
        </RectButton>
      ))}
    </ScrollView>
  )
}

export default RadarSongList
