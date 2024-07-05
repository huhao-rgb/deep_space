import type { FC } from 'react'
import { memo, useMemo } from 'react'

import Animated, {
  withTiming,
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue
} from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

import type { CostomTrack } from '@/hooks'

import { Image } from 'expo-image'

import { tw } from '@/utils'
import { usePlayerContext, GestureState } from './Context'

interface CoverSwitchProps {
  songList: CostomTrack[]
  currentIndex: number
  size: number
  windowWidth: number
  threshold?: number // 切换的阈值，手指滑动多远的距离触发onFinish事件
  onTap?: () => void
  onStart?: () => void // 滑动开始
  onFinish?: (isPre: boolean) => void
}

interface ConcealCoverProps {
  isLeft?: boolean
  size: number
  translationX: SharedValue<number>
  songList: CostomTrack[]
  currentIndex: number
  threshold: number
  gestureState: SharedValue<GestureState>
}

const getPicUrl = (list: CostomTrack[], index: number) => {
  const picPrefix = list?.[index]?.al?.picUrl
  if (picPrefix) return `${picPrefix}?param=800y800`
  return ''
}

const ConcealCover: FC<ConcealCoverProps> = (props) => {
  const {
    isLeft,
    size,
    translationX,
    songList,
    currentIndex,
    threshold,
    gestureState
  } = props

  const derivedTranslationX = useDerivedValue(() => {
    if (gestureState.value === GestureState.ENDED) {
      const distance = size * (isLeft ? 1 : -1)
      const canRoll = Math.abs(translationX.value) >= threshold
      return withTiming(canRoll ? distance : 0)
    }
    return translationX.value
  })

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: typeof derivedTranslationX === 'number'
          ? derivedTranslationX
          : derivedTranslationX.value
      }]
    }
  })

  const calculateCoverUri = useMemo(
    () => {
      const len = songList.length
      switch (len) {
        case 0:
          return undefined
        case 1:
          return getPicUrl(songList, currentIndex)
        case 2:
          return getPicUrl(songList, 1)
        default:
          const preIndex = currentIndex === 0 ? len - 1 : currentIndex - 1
          const nextIndex = currentIndex === len - 1 ? 0 : currentIndex + 1
          const index = isLeft ? preIndex : nextIndex
          return getPicUrl(songList, index)
      }
    },
    [songList, currentIndex, isLeft]
  )

  return (
    <Animated.View
      style={[
        tw`absolute top-0 right-0 z-10`,
        isLeft ? { left: -size } : { right: -size },
        stylez
      ]}
    >
      <Image
        source={{ uri: calculateCoverUri }}
        style={[
          { width: size, height: size },
          tw`rounded-2xl`
        ]}
      />
    </Animated.View>
  )
}

const CoverSwitch = memo<CoverSwitchProps>((props) => {
  const {
    songList,
    currentIndex,
    size,
    windowWidth,
    threshold = (size || 100) * 0.3,
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
      scale.value = (windowWidth - Math.abs(currentValue) / 3) / windowWidth
    }
  )

  useAnimatedReaction(
    () => gestureState.value,
    (currentState) => {
      if (currentState === GestureState.ENDED) {
        if (Math.abs(panTranslatioinX.value) > threshold) {
          const isPre = panTranslatioinX.value > 0
          if (onFinish) {
            runOnJS<boolean[], void>(onFinish)(isPre)
          }
        }

        panTranslatioinX.value = 0
        scale.value = withTiming(1)
      }
    },
    [currentIndex]
  )

  const tap = Gesture.Tap()
    .onEnd(() => {
      if (onTap) runOnJS(onTap)()
    })

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          { height: size, position: 'relative' }
        ]}
      >
        <Animated.View
          style={[
            tw`w-full overflow-hidden flex-row justify-center`,
            stylez
          ]}
        >
          <Image
            source={{ uri: getPicUrl(songList, currentIndex) }}
            style={[
              { width: size, height: size },
              tw`rounded-2xl`
            ]}
          />
        </Animated.View>

        <ConcealCover
          isLeft={true}
          translationX={panTranslatioinX}
          size={size}
          songList={songList}
          currentIndex={currentIndex}
          threshold={threshold}
          gestureState={gestureState}
        />

        <ConcealCover
          isLeft={false}
          translationX={panTranslatioinX}
          size={size}
          songList={songList}
          currentIndex={currentIndex}
          threshold={threshold}
          gestureState={gestureState}
        />
      </Animated.View>
    </GestureDetector>
  )
})

export default CoverSwitch
