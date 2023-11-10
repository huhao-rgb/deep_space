import { memo } from 'react'

import Animated, {
  withTiming,
  runOnJS,
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

import { Image } from 'expo-image'

import { tw } from '@/utils'

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
    onStart,
    onFinish
  } = props

  const scale = useSharedValue(1)
  const startX = useSharedValue(0)
  const panTranslatioinX = useSharedValue(0)

  const stylez = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  const pan = Gesture.Pan()
    .onBegin((event) => {
      const { translationX } = event
      startX.value = translationX
      if (onStart) runOnJS(onStart)()
    })
    .onChange((event) => {
      const { translationX } = event
      panTranslatioinX.value = translationX
      scale.value = (windowWidth - Math.abs(translationX)) / windowWidth
    })
    .onFinalize(() => {
      if (Math.abs(panTranslatioinX.value) - startX.value > threshold) {
        const isPre = panTranslatioinX.value > startX.value
        if (onFinish) runOnJS<boolean[], void>(onFinish)(isPre)
      }
      scale.value = withTiming(1)
      startX.value = 0
      panTranslatioinX.value = 0
    })

  const tap = Gesture.Tap()
    .onEnd(() => {
      if (onTap) runOnJS(onTap)()
    })

  const composed = Gesture.Race(pan, tap)

  return (
    <GestureDetector gesture={composed}>
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
