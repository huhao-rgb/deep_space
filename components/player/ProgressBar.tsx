import {
  memo,
  useEffect,
  useCallback
} from 'react'

import { View, Text } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import TrackPlayer, { useProgress } from 'react-native-track-player'
import { useSharedValue } from 'react-native-reanimated'
import { Slider } from 'react-native-awesome-slider'

import { tw, formatTime } from '@/utils'

interface ProgressBarProps {
  style?: StyleProp<ViewStyle>
  onChange?: () => void
}

const timeTextStyle = tw`text-2xs text-gray-400 w-12`

const ProgressBar = memo<ProgressBarProps>((props) => {
  const { style } = props

  const { position, buffered, duration } = useProgress()

  const progress = useSharedValue(0)
  const min = useSharedValue(0)
  const max = useSharedValue(0)
  const cache = useSharedValue(0)
  const isSlidering = useSharedValue(false)

  useEffect(
    () => {
      if (duration > 0) max.value = duration
    },
    [duration]
  )

  useEffect(
    () => {
      if (isSlidering.value) return
      progress.value = position
    },
    [position, isSlidering]
  )

  useEffect(
    () => {
      cache.value = buffered
    },
    [buffered]
  )

  const onSlidingStart = useCallback(
    () => { isSlidering.value = true },
    []
  )

  const onSlidingComplete = useCallback(
    (value: number) => {
      TrackPlayer.seekTo(value)
        .finally(() => {
          isSlidering.value = false
        })
    },
    []
  )

  return (
    <View style={[tw`flex-row items-center`, style]}>
      <Text style={timeTextStyle}>{formatTime(position)}</Text>
      <View style={tw`flex-1`}>
        <Slider
          progress={progress}
          minimumValue={min}
          maximumValue={max}
          cache={cache}
          theme={{
            minimumTrackTintColor: tw.color('slate-700'),
            maximumTrackTintColor: tw.color('gray-100'),
            cacheTrackTintColor: tw.color('gray-300')
          }}
          renderBubble={() => null}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
        />
      </View>
      <Text style={[timeTextStyle, tw`text-right`]}>{formatTime(duration)}</Text>
    </View>
  )
})

export default ProgressBar
