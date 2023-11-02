import type { FC } from 'react'
import { useEffect } from 'react'

import { View, useWindowDimensions } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

import { tw } from '@/utils'

const ProgressBar: FC = () => {
  const { width } = useWindowDimensions()

  const widthValue = useSharedValue(0)
  const stylez = useAnimatedStyle(() => ({
    width: withTiming(`${widthValue.value}%`)
  }))

  useEffect(
    () => {
      let i = 0
      setInterval(() => {
        i += 1
        widthValue.value = i

        if (i === 100) i = 0
      }, 1000)
    },
    []
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
