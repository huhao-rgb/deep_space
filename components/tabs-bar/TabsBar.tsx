import type { FC } from 'react'

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
        scrollEventThrottle={16}
        scrollsToTop={false}
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`flex-row flex-nowrap overflow-hidden`}
      >
        {routes.map((route, i) => (
          renderTabsBarItem({
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

export default TabsBar
