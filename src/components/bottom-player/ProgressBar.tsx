import type { FC } from 'react'
import { useEffect } from 'react'

import { View, useWindowDimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated'
import { useProgress } from 'react-native-track-player'

import { tw } from '@/utils'

const ProgressBar: FC = () => {
  const { width } = useWindowDimensions()

  const { position, duration } = useProgress()

  const widthValue = useSharedValue(0)
  const stylez = useAnimatedStyle(() => ({
    width: withTiming(widthValue.value)
  }))

  useEffect(
    () => {
      if (duration > 0) {
        const per = position / duration
        widthValue.value = per * width
      }
    },
    [position, duration, width]
  )

  return (
    <View style={[tw`h-1 bg-gray-200/60`, { width }]}>
      <Animated.View
        style={[
          tw`absolute left-0 h-1 bg-red-500`,
          stylez
        ]}
      />
    </View>
  )
}

export default ProgressBar
