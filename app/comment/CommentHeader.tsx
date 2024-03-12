import type { FC } from 'react'
import { useMemo, useCallback } from 'react'

import { View, Text } from 'react-native'
import type { LayoutChangeEvent } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { Image } from 'expo-image'

import { tw } from '@/utils'
import { SortType } from '@/api/types'

interface Props {
  imgUrl: string
  title: string
  subtitle: string
  sortType: SortType
  commentsTitle: string
  totalCount: number
  offsetY: SharedValue<number>
}

const CommentHeader: FC<Props> = (props) => {
  const {
    imgUrl,
    title,
    subtitle,
    sortType,
    commentsTitle,
    totalCount,
    offsetY
  } = props

  const headerHeight = useSharedValue(0)

  const imageUrl = useMemo(
    () => {
      if (imgUrl) {
        return `${imgUrl}?param=150y150`
      }
      return ''
    },
    [imgUrl]
  )

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout
      headerHeight.value = height
    },
    []
  )

  const stylez = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(
        offsetY.value,
        [0, headerHeight.value, headerHeight.value + 1],
        [0, 0, 1]
      )
    }]
  }))

  return (
    <>
      <View
        style={tw`px-5 pt-1 pb-3 flex-row items-center`}
        onLayout={onLayout}
      >
        <Image
          source={{ uri: imageUrl }}
          style={tw`w-16 h-16 rounded-md`}
        />
        <View style={tw`ml-3`}>
          <Text style={tw`text-base text-slate-600`}>
            {title}
          </Text>
          <Text style={tw`text-sm text-slate-400`}>
            {subtitle}
          </Text>
        </View>
      </View>

      <Animated.View
        style={[
          tw`pt-2 bg-gray-100 z-10`,
          stylez
        ]}
      >
        <View style={tw`px-5 py-3 flex-row items-center justify-between bg-white`}>
          <Text style={tw`text-sm font-bold text-slate-500`}>
            {commentsTitle}（{totalCount}）
          </Text>
        </View>
      </Animated.View>
    </>
  )
}

export default CommentHeader
