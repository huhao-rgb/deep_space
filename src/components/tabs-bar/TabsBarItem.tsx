import type { FC } from 'react'

import { View, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import { activeOpacity } from '@/constants'
import { tw } from '@/utils'

import type { RenderTabsBarItemProps } from './types'

const activeColor = tw.color('red-500')
const inactiveColor = tw.color('gray-600')

const TabsBarItem: FC<RenderTabsBarItemProps> = (props) => {
  const {
    route,
    scrollEnabled,
    keyExtractor,
    index,
    style,
    labelStyle,
    onLayout,
    onTabBarItemPress,
    onTabsBarItemLongPress
  } = props

  return (
    <View
      key={keyExtractor}
      onLayout={onLayout}
    >
      <RectButton
        rippleColor={tw.color('red-200/10')}
        activeOpacity={activeOpacity}
        onPress={onTabBarItemPress}
        onLongPress={onTabsBarItemLongPress}
      >
        <Animated.View
          style={[
            tw`flex-row justify-center items-center bg-gray-500`,
            scrollEnabled
              ? tw`px-4`
              : tw`flex-1`,
            { height: 48 }
          ]}
        >
          <Text
            style={[
              tw`text-sm font-medium`,
              labelStyle
            ]}
          >
            {route.title}
          </Text>
        </Animated.View>
      </RectButton>
    </View>
  )
}

export default TabsBarItem
