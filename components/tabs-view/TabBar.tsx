import type { FC } from 'react'
import {
  useRef,
  useCallback,
  useState
} from 'react'

import type { LayoutChangeEvent } from 'react-native'
import { View, useWindowDimensions } from 'react-native'
import Animated, {
  scrollTo,
  cancelAnimation,
  withTiming,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedReaction
} from 'react-native-reanimated'

import { useTabsViewContext } from './Context'
import TabBarItem from './TabBarItem'

import type { TabBarProps, Route } from './types'

import { tw } from '@/utils'

interface ItemLayout {
  width: number
  x: number
}

const TabBar: FC<TabBarProps> = (props) => {
  const {
    routes,
    width: containerWidth,
    tabsBarScrollEnabled,
    tabsBarStyle,
    onTabPress,
    onTabLongPress
  } = props

  const { currentPage, scrollPosition } = useTabsViewContext()

  const currentPageToSync = useSharedValue(currentPage.value)
  const targetIndexToSync = useSharedValue(currentPage.value)

  const { width } = useWindowDimensions()
  const w = containerWidth ?? width

  const [itemsLayout, setItemsLayout] = useState<ItemLayout[]>(
    tabsBarScrollEnabled
      ? routes.map((_, i) => {
        const tabWidth = w / routes.length
        return { width: tabWidth, x: i * tabWidth }
      })
      : []
  )

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>()
  const itemLayoutGathering = useRef(new Map<Route['key'], ItemLayout>())

  const tabsOffset = useSharedValue(0)
  const isScrolling = useSharedValue(false)

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        tabsOffset.value = event.contentOffset.x
      },
      onBeginDrag: () => {
        isScrolling.value = true
      },
      onMomentumEnd: () => {
        isScrolling.value = false
      }
    }
  )

  const onLayout = useCallback(
    (e: LayoutChangeEvent, route: Route) => {
      if (tabsBarScrollEnabled) {
        if (!e.nativeEvent?.layout) return

        const { width, x } = e.nativeEvent.layout

        itemLayoutGathering.current.set(route.key, { width, x })

        const itemLayouts = Array.from(itemLayoutGathering.current.entries())
          .map(([, layout]) => layout)
          .sort((a, b) => a.x - b.x)

        if (itemLayouts.length === routes.length) {
          setItemsLayout(itemLayouts)
        }
      }
    },
    [routes, tabsBarScrollEnabled]
  )

  useAnimatedReaction(
    () => currentPage.value,
    (nextIndex) => {
      if (tabsBarScrollEnabled) {
        cancelAnimation(currentPageToSync)
        targetIndexToSync.value = nextIndex
        currentPageToSync.value = withTiming(nextIndex)
      }
    },
    [currentPage]
  )

  useAnimatedReaction(
    () => currentPageToSync.value === targetIndexToSync.value,
    (canSync) => {
      if (
        canSync &&
        tabsBarScrollEnabled &&
        itemsLayout.length === routes.length &&
        itemsLayout[currentPage.value]
      ) {
        const halfTab = itemsLayout[currentPage.value].width / 2
        const offset = itemsLayout[currentPage.value].x

        if (
          offset < tabsOffset.value ||
          offset > tabsOffset.value + width - 2 * halfTab
        ) {
          scrollTo(scrollViewRef, offset - width / 2 + halfTab, 0, true)
        }
      }
    },
    [itemsLayout, tabsBarScrollEnabled]
  )

  return (
    <View style={[tw`w-full`, tabsBarStyle]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal={true}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        scrollsToTop={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={tabsBarScrollEnabled}
        contentContainerStyle={[tw`flex-row flex-nowrap overflow-hidden`]}
        onScroll={onScroll}
      >
        {routes.map((route, i) => (
          <TabBarItem
            index={i}
            key={route.key}
            keyExtractor={route.key}
            scrollEnabled={tabsBarScrollEnabled}
            scrollPosition={scrollPosition}
            label={route.title ?? ''}
            onLayout={(event) => { onLayout(event, route) }}
            onPress={onTabPress}
            onLongPress={onTabLongPress}
          />
        ))}
      </Animated.ScrollView>
    </View>
  )
}

export default TabBar
