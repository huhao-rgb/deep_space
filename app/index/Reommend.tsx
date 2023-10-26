import type { FC } from 'react'

import {
  ScrollView,
  View,
  Text
} from 'react-native'

import { Image } from 'expo-image'
import { RectButton } from 'react-native-gesture-handler'

import tw from '@/utils/tailwind'

interface Props {
  data: any[]
}

const Reommend: FC<Props> = (props) => {
  const { data } = props

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
          rippleColor={tw.color('red-50')}
          activeOpacity={0.8}
        >
          <View
            style={[
              tw`w-28`,
              i !== 0 && i !== data.length - 1 && tw`mx-1`,
              i === 0 && tw`mr-1`,
              i === data.length - 1 && tw`ml-1`
            ]}
          >
            <View style={tw`relative`}>
              <Image
                source={{ uri: `${item.uiElement.image.imageUrl}?param=300y300` }}
                style={tw`w-28 h-28 rounded-xl bg-gray-100`}
              />
            </View>
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
