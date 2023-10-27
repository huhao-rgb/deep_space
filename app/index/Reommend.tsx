import type { FC } from 'react'

import {
  ScrollView,
  View,
  Text
} from 'react-native'

import { RectButton } from 'react-native-gesture-handler'

import { Image } from 'expo-image'
import { router } from 'expo-router'

import SongListCover from './SongListCover'

import tw from '@/utils/tailwind'

interface Props {
  data: any[]
}

const Reommend: FC<Props> = (props) => {
  const { data } = props

  const openSongListDetailPage = (item: any) => {
    if (item.creativeId) {
      router.push(`/song-list-detail/${item.creativeId}`)
    }
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`px-5`}
    >
      {data.map((item, i) => (
        <RectButton
          key={`recommend_${i}`}
          borderless={false}
          rippleColor={tw.color('red-100')}
          activeOpacity={0.8}
          onPress={() => { openSongListDetailPage(item) }}
        >
          <View
            style={[
              tw`w-28`,
              i !== 0 && i !== data.length - 1 && tw`mx-1`,
              i === 0 && tw`mr-1`,
              i === data.length - 1 && tw`ml-1`
            ]}
          >
            <SongListCover
              cover={item.uiElement.image.imageUrl}
            />
            <Text
              style={[tw`mt-1 text-gray-800 text-sm`]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.uiElement.mainTitle.title}
            </Text>
          </View>
        </RectButton>
      ))}
    </ScrollView>
  )
}

export default Reommend
