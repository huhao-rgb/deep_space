/**
 * 底部mini播放控件
 * 动画配置可以参考 withTIming函数：https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming
 */
import {
  forwardRef,
  memo,
  useImperativeHandle,
  useCallback
} from 'react'

import { View, Text } from 'react-native'
import type { LayoutChangeEvent } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { BorderlessButton } from 'react-native-gesture-handler'
import { Shadow } from 'react-native-shadow-2'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Image } from 'expo-image'

import Icon from '@/components/svg-icon'

import { tw } from '@/utils'
import { usePlayer } from '@/store'

import type { BottomPlayerProps } from './types'

const ptValue = tw`pt-2`.paddingTop as number

const BottomPlayer = forwardRef<unknown, BottomPlayerProps>((props, ref) => {
  const {
    easing = Easing.bezier(0.57, 0.18, 0.26, 0.99),
    duration = 400
  } = props

  const { bottom } = useSafeAreaInsets()

  const [miniPlayerHeight, setMniPlayerHeight] = usePlayer((s) => [s.miniPlayerHeight, s.setMniPlayerHeight])

  const bottomValue = useSharedValue(-miniPlayerHeight)
  const playerStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomValue.value }]
  }))

  const setBottomValue = useCallback(
    (value: number) => {
      bottomValue.value = withTiming(value, { duration, easing })
    },
    [easing, duration]
  )

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { layout } = event.nativeEvent
      setMniPlayerHeight(layout.height)
    },
    []
  )

  useImperativeHandle(ref, () => ({
    setShowPlayer: (show: boolean) => {
      setBottomValue(show ? 0 : miniPlayerHeight)
    }
  }))

  return (
    <Animated.View
      style={[
        playerStyles,
        tw`absolute left-0 right-0`
      ]}
      onLayout={onLayout}
    >
      <Shadow
        startColor="#00000010"
        distance={16}
        offset={[0, 3]}
        style={[
          { paddingBottom: bottom + ptValue },
          tw`flex-1 px-5 flex-row items-center bg-white`
        ]}
      >
        <View
          style={[
            { paddingTop: ptValue },
            tw`flex-1 flex-row items-center`
          ]}
        >
          <Image
            source={{ uri: 'http://p1.music.126.net/t48bbdJaeUBFH_FA2Y_xPQ==/3241360279386508.jpg?param=80y80' }}
            style={tw`h-12 w-12 rounded-lg`}
          />
          <View style={tw`flex-1 ml-4`}>
            <Text
              numberOfLines={1}
              style={tw`text-slate-800 text-sm font-bold`}
            >
              Home to Mama
            </Text>
            <Text
              numberOfLines={1}
              style={tw`text-slate-500 text-xs`}
            >
              Justin Bieber
            </Text>
          </View>
        </View>
        <View style={tw`flex-row items-center`}>
          <BorderlessButton
            style={tw`p-1`}
          >
            <Icon
              name="SolidPlay"
              width={16}
              height={16}
              fill={tw.color('slate-700')}
            />
          </BorderlessButton>
          <BorderlessButton
            style={tw`ml-4`}
          >
            <Icon
              name="List"
              width={24}
              height={24}
              fill={tw.color('slate-700')}
            />
          </BorderlessButton>
        </View>
      </Shadow>
    </Animated.View>
  )
})

export default memo(BottomPlayer)
