import type { FC } from 'react'
import { useCallback } from 'react'

import { View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

import { activeOpacity } from '@/constants'

import type { TabBarItemProps } from './types'

import { tw } from '@/utils'

const activeColor = tw.color('red-500')
const inactiveColor = tw.color('gray-600')

const TabBarItem: FC<TabBarItemProps> = (props) => {
  const {
    label,
    keyExtractor,
    index,
    labelStyle,
    scrollEnabled,
    scrollPosition,
    onPress,
    onLongPress,
    onLayout
  } = props

  const onTabBarItemPress = useCallback(
    () => {
      onPress?.(keyExtractor)
    },
    [onPress, keyExtractor]
  )

  const onTabsBarItemLongPress = useCallback(
    () => {
      onLongPress?.(keyExtractor)
    },
    [onPress, keyExtractor]
  )

  const stylez = useAnimatedStyle(() => {
    return {
      color: Math.abs(index - scrollPosition.value) < 0.5
        ? activeColor
        : inactiveColor
    }
  })

  return (
    <View onLayout={onLayout}>
      <RectButton
        rippleColor={tw.color('red-200/10')}
        activeOpacity={activeOpacity}
        onPress={onTabBarItemPress}
        onLongPress={onTabsBarItemLongPress}
      >
        <Animated.View
          style={[
            tw`flex-row justify-center items-center`,
            scrollEnabled
              ? tw`px-4`
              : tw`flex-1`,
            { height: 48 }
          ]}
        >
          <Animated.Text
            style={[
              tw`text-sm font-medium`,
              stylez,
              labelStyle
            ]}
          >
            {label}
          </Animated.Text>
        </Animated.View>
      </RectButton>
    </View>
  )
}

export default TabBarItem
