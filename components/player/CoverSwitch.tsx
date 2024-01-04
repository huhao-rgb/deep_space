import { memo, useCallback, useState } from 'react'

import Animated, {
  withTiming,
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction
} from 'react-native-reanimated'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

import { usePlayer } from '@/store'
import type { CostomTrack } from '@/hooks'
import { shallow } from 'zustand/shallow'

import { Image } from 'expo-image'

import { tw } from '@/utils'
import { usePlayerContext, GestureState } from './Context'

interface CoverSwitchProps {
  currentIndex: number
  size: number
  windowWidth: number
  threshold?: number // 切换的阈值，手指滑动多远的距离触发onFinish事件
  onTap?: () => void
  onStart?: () => void // 滑动开始
  onFinish?: (isPre: boolean) => void
}

interface Cover {
  id: number
  uri: string
}

const halfBackGauge = (tw`px-5`.paddingLeft as number) / 2

const getThreeCoverUrl = (list: CostomTrack[], index: number): Cover[] => {
  const length = list.length

  if (length === 0) return []

  const nextIndex = index === length - 1 ? 0 : index + 1
  const preIndex = index === 0 ? length - 1 : index - 1
  const indexs = [preIndex, index, nextIndex]

  return indexs.map(i => ({
    id: list[i]?.id ?? '',
    uri: `${list[i]?.al?.picUrl}?param=1000y1000`
  }))
}

const CoverSwitch = memo<CoverSwitchProps>((props) => {
  const {
    currentIndex,
    size,
    windowWidth,
    threshold = 30,
    onTap,
    onFinish
  } = props

  const [songList] = usePlayer(
    (s) => [s.songList],
    shallow
  )

  const [covers, setCovers] = useState<Cover[]>(getThreeCoverUrl(songList, currentIndex))

  const {
    gestureState,
    translationX
  } = usePlayerContext()

  const scale = useSharedValue(1)
  const panTranslatioinX = useSharedValue(0)

  const stylez = useAnimatedStyle(() => ({
    transform: [{ translateX: panTranslatioinX.value }]
  }))

  useAnimatedReaction(
    () => translationX.value,
    (currentValue, _) => {
      panTranslatioinX.value = currentValue
      scale.value = (windowWidth - Math.abs(currentValue)) / windowWidth
    }
  )

  const setCoverList = useCallback(
    (isPre: boolean) => {
      let index: number = 0

      if (isPre) {
        index = currentIndex === 0 ? songList.length - 1 : currentIndex - 1
      } else {
        index = currentIndex === songList.length - 1 ? 0 : currentIndex + 1
      }

      const list = getThreeCoverUrl(songList, index)
      setCovers(list)
      console.log(list)
      // setCovers(list)
    },
    [songList, currentIndex]
  )

  useAnimatedReaction(
    () => gestureState.value,
    (currentState) => {
      if (currentState === GestureState.ENDED) {
        if (Math.abs(panTranslatioinX.value) > threshold) {
          const isPre = panTranslatioinX.value > 0
          console.log(panTranslatioinX.value)
          if (onFinish) {
            // runOnJS<boolean[], void>(onFinish)(isPre)
            panTranslatioinX.value = withTiming(
              (size + halfBackGauge * 2) * (isPre ? 1 : -1),
              undefined,
              () => {
                runOnJS(setCoverList)(isPre)
                panTranslatioinX.value = 0
              }
            )
          }
        } else {
          panTranslatioinX.value = 0
        }
      }
    },
    [setCoverList]
  )

  const tap = Gesture.Tap()
    .onEnd(() => {
      if (onTap) runOnJS(onTap)()
    })

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          tw`w-full overflow-hidden flex-row justify-center`,
          { height: size }
        ]}
      >
        <Animated.View
          style={[
            stylez,
            tw`flex-row`,
            { paddingHorizontal: halfBackGauge }
          ]}
        >
          {covers.map((cover, i) => (
            <Image
              source={{ uri: cover.uri }}
              key={`cover_image-${cover.id}`}
              style={[
                {
                  width: size,
                  height: size,
                  marginHorizontal: halfBackGauge
                },
                tw`rounded-2xl`
              ]}
            />
          ))}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
})

export default CoverSwitch
