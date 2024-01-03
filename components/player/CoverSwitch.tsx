import { memo } from 'react'

import Animated, {
  withTiming,
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction
} from 'react-native-reanimated'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

import { Image } from 'expo-image'

import { tw } from '@/utils'
import { usePlayerContext, GestureState } from './Context'

interface CoverSwitchProps {
  uri?: string
  size: number
  windowWidth: number
  threshold?: number // 切换的阈值，手指滑动多远的距离触发onFinish事件
  onTap?: () => void
  onStart?: () => void // 滑动开始
  onFinish?: (isPre: boolean) => void
}

const CoverSwitch = memo<CoverSwitchProps>((props) => {
  const {
    uri,
    size,
    windowWidth,
    threshold = 30,
    onTap,
    onFinish
  } = props

  const {
    gestureState,
    translationX
  } = usePlayerContext()

  const scale = useSharedValue(1)
  const panTranslatioinX = useSharedValue(0)

  const stylez = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  useAnimatedReaction(
    () => translationX.value,
    (currentValue, _) => {
      panTranslatioinX.value = currentValue
      scale.value = (windowWidth - Math.abs(currentValue)) / windowWidth
    }
  )

  useAnimatedReaction(
    () => gestureState.value,
    (currentState) => {
      if (currentState === GestureState.ENDED) {
        if (Math.abs(panTranslatioinX.value) > threshold) {
          const isPre = panTranslatioinX.value > 0
          if (onFinish) runOnJS<boolean[], void>(onFinish)(isPre)
        }
        scale.value = withTiming(1)
        panTranslatioinX.value = 0
      }
    }
  )

  const tap = Gesture.Tap()
    .onEnd(() => {
      if (onTap) runOnJS(onTap)()
    })

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={stylez}>
        <Image
          source={{ uri }}
          style={[
            { width: size, height: size },
            tw`rounded-2xl`
          ]}
        />
      </Animated.View>
    </GestureDetector>
  )
})

export default CoverSwitch
