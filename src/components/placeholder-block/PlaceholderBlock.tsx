import type { FC } from 'react'
import { useEffect } from 'react'

import { useShallow } from 'zustand/react/shallow'

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated'

import { tw } from '@/utils'
import { usePlayerState } from '@/store'

const PlaceholderBlock: FC = () => {
  const height = useSharedValue(0)

  const [
    miniPlayerHeight,
    showMiniPlayer
  ] = usePlayerState(
    useShallow((s) => [
      s.miniPlayerHeight,
      s.showMiniPlayer
    ])
  )

  useEffect(
    () => {
      height.value =
        showMiniPlayer ? miniPlayerHeight : 0
    },
    [miniPlayerHeight, showMiniPlayer]
  )

  const stylez = useAnimatedStyle(() => ({
    height: withTiming(
      height.value,
      {
        duration: 200,
        easing: Easing.inOut(Easing.quad)
      }
    )
  }))

  return (
    <Animated.View
      style={[
        tw`bg-white`,
        stylez
      ]}
    />
  )
}

export default PlaceholderBlock