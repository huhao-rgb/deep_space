/**
 * 底部mini播放控件
 * 动画配置可以参考 withTIming函数：https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming
 */
import {
  forwardRef,
  useImperativeHandle,
  useCallback
} from 'react'

import { Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { tw } from '@/utils'

import type { BottomPlayerProps } from './types'

const BottomPlayer = forwardRef<unknown, BottomPlayerProps>((props, ref) => {
  const {
    easing = Easing.bezier(0.57, 0.18, 0.26, 0.99),
    duration = 800
  } = props

  const { bottom } = useSafeAreaInsets()

  const bottomValue = useSharedValue(0)
  const playerStyles = useAnimatedStyle(() => ({
    bottom: bottomValue.value
  }))

  const setBottomValue = useCallback(
    (value: number) => {
      bottomValue.value = withTiming(value, { duration, easing })
    },
    [easing, duration]
  )

  useImperativeHandle(ref, () => ({
    openPlayer: () => {
      setBottomValue(30)
    }
  }))

  return (
    <Animated.View
      style={[
        { paddingBottom: bottom },
        playerStyles,
        tw`absolute left-0 right-0`
      ]}
    >
      <Text>测试底部播放器</Text>
    </Animated.View>
  )
})

export default BottomPlayer
