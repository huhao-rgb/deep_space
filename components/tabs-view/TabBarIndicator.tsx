import type { FC } from 'react'
import { useEffect } from 'react'

import { I18nManager } from 'react-native'
import Animated, {
  withTiming,
  interpolate,
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated'

import { useTabsViewContext } from './Context'
import type { TabBarIndicatorProps } from './types'

import { tw } from '@/utils'

const { isRTL } = I18nManager

const TabBarIndicator: FC<TabBarIndicatorProps> = (props) => {
  const {
    indicatorWidth = 15,
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
      const transform =
      itemsLayout.length > 1
        ? [
            {
              translateX: interpolate(
                scrollPosition.value,
                itemsLayout.map((_, i) => i),
                itemsLayout.map((v) => {
                  const left = v.width / 2 - indicatorWidth / 2 + v.x
                  return isRTL ? -1 * left : left
                })
              )
            }
          ]
        : undefined

    return {
      opacity: withTiming(opacity.value),
      transform
    }
    },
    []
  )

  return (
    <Animated.View
      style={[
        tw`absolute bottom-0 z-10 h-2 bg-red-500 rounded-md`,
        stylez,
        { width: indicatorWidth }
      ]}
    />
  )
}

export default TabBarIndicator
