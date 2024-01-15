import type { FC } from 'react'
import { memo } from 'react'

import {
  View,
  Text,
  Animated
} from 'react-native'

import type { TabsBarProps } from './types'

import TabsBarItem from './TabsBarItem'

import { tw } from '@/utils'

const TabsBar: FC<TabsBarProps> = (props) => {
  const {
    navigationState,
    scrollEnabled = true,
    style,
    tabsBarItemStyle,
    renderTabsBarItem = (tItemProps) => <TabsBarItem {...tItemProps} />
  } = props

  const { routes } = navigationState

  return (
    <View style={[tw`w-full`, style]}>
      <Animated.ScrollView
        horizontal
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        scrollsToTop={false}
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`flex-row flex-nowrap overflow-hidden`}
        style={tw`bg-gray-200`}
      >
        {routes.map((route, i) => (
          renderTabsBarItem({
            scrollEnabled,
            route,
            index: i,
            keyExtractor: `tabs_bar_item_${i}`,
            style: tabsBarItemStyle
          })
        ))}
      </Animated.ScrollView>
    </View>
  )
}

export default memo(TabsBar)
