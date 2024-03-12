import type { FC } from 'react'
import { useEffect } from 'react'

import { I18nManager } from 'react-native'
import Animated, {
  withTiming,
  interpolate,
  Extrapolation,
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated'

import { useTabsViewContext } from './Context'
import type { TabBarIndicatorProps } from './types'

import { tw } from '@/utils'

const { isRTL } = I18nManager

const TabBarIndicator: FC<TabBarIndicatorProps> = (props) => {
  const {
    indicatorWidth = 18,
    itemsLayout
  } = props

  const { scrollPosition } = useTabsViewContext()

  const opacity = useSharedValue(0)

  useEffect(
    () => {
      if (itemsLayout.length > 1 && opacity.value === 0) opacity.value = 1
    },
    [itemsLayout, opacity]
  )

  const stylez = useAnimatedStyle(
    () => {
      const canAnimated = itemsLayout.length > 1

      let transform = undefined

      if (canAnimated) {
        const maxScaleXCount = itemsLayout.length * 2 - 1

        const outputRange: number[] = []
        const inputRange = Array.from(
          { length: maxScaleXCount },
          (v, i) => {
            const tabWidth = itemsLayout[Math.floor(i / 2)].width
            outputRange.push(i % 2 ? tabWidth / (tabWidth * 0.3) : 1)
            return i / 2
          }
        )

        transform = [
          {
            translateX: interpolate(
              scrollPosition.value,
              itemsLayout.map((_, i) => i),
              itemsLayout.map((v) => {
                const left = v.width / 2 - indicatorWidth / 2 + v.x
                return isRTL ? -1 * left : left
              })
            )
          },
          {
            scaleX: interpolate(
              scrollPosition.value,
              inputRange,
              outputRange,
              {
                extrapolateLeft: Extrapolation.CLAMP,
                extrapolateRight: Extrapolation.CLAMP
              }
            )
          }
        ]
      }

      return {
        opacity: withTiming(opacity.value),
        transform
      }
    },
    [itemsLayout]
  )

  return (
    <Animated.View
      style={[
        tw`absolute bottom-0 z-10 h-1 bg-red-500 rounded-md`,
        stylez,
        { width: indicatorWidth }
      ]}
    />
  )
}

export default TabBarIndicator
