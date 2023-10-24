import { memo, useCallback } from 'react'

import { View, useWindowDimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedRef
} from 'react-native-reanimated'
import PagerView, {
  PageScrollStateChangedNativeEventData,
  PagerViewOnPageScrollEventData,
  PagerViewOnPageSelectedEventData
} from 'react-native-pager-view'

import type {
  TabsViewProps,
  Route,
  SceneRendererProps
} from './types'

import { TabsViewContextProvider } from './Context'
import {
  usePagerScrollHandler,
  usePageSelectedHandler,
  usePageScrollStateChangedHandler
} from './hooks'
import type { KeyExtractor } from './types'

import SceneView from './SceneView'
import TabBar from './TabBar'

import { tw } from '@/utils'

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)

const TabsView = memo<TabsViewProps<Route>>((props) => {
  const {
    routes,
    initialPage = 0,
    lazy = true,
    tabsBarScrollEnabled = false,
    labelStyle,
    tabStyle,
    width: customWidth,
    style,
    renderLazyPlaceholder = (lazyBarProps) => null,
    renderTabBar = (tabBarProps) => <TabBar {...tabBarProps} />,
    renderScene
  } = props

  const width = customWidth ?? useWindowDimensions().width

  const apRef = useAnimatedRef<PagerView>()

  const scrollPosition = useSharedValue(0)
  const currentPage = useSharedValue(initialPage)
  const scrollState = useSharedValue<PageScrollStateChangedNativeEventData['pageScrollState']>('idle')

  const jumpTo = useCallback(
    (key: KeyExtractor) => {
      const cIndex = routes.findIndex((route) => route.key === key)
      apRef.current?.setPage(cIndex)
    },
    [apRef]
  )

  const sceneRendererProps: SceneRendererProps = {
    position: scrollPosition,
    jumpTo
  }

  const onPageScroll = usePagerScrollHandler({
    onPageScroll: (e: PagerViewOnPageScrollEventData) => {
      'worklet'
      scrollPosition.value = e.offset + e.position
    }
  })

  const onPageSelected = usePageSelectedHandler({
    onPageSelected: (e: PagerViewOnPageSelectedEventData) => {
      'worklet'
      currentPage.value = e.position
    }
  })

  const onPageScrollStateChanged = usePageScrollStateChangedHandler({
    onPageScrollStateChanged: (e: PageScrollStateChangedNativeEventData) => {
      'worklet'
      scrollState.value = e.pageScrollState
    }
  })

  const onTabPress = useCallback(
    (key: KeyExtractor) => {
      if (scrollState.value !== 'dragging') jumpTo(key)
    },
    []
  )

  return (
    <TabsViewContextProvider
      value={{
        scrollPosition,
        currentPage
      }}
    >
      <View style={[tw`flex-1`, style]}>
        {renderTabBar({
          ...sceneRendererProps,
          routes,
          width,
          scrollEnabled: tabsBarScrollEnabled,
          tabStyle,
          labelStyle,
          onTabPress
        })}
        <AnimatedPagerView
          ref={apRef}
          initialPage={initialPage}
          orientation="horizontal"
          style={tw`flex-1`}
          onPageScroll={onPageScroll}
          onPageSelected={onPageSelected}
          onPageScrollStateChanged={onPageScrollStateChanged}
        >
          {routes.map((route, i) => (
            <SceneView
              key={`scene_view_${i}`}
              index={i}
              lazy={lazy}
            >
              {({ loading }) => (
                loading
                  ? renderLazyPlaceholder({ route })
                  : renderScene({
                      ...sceneRendererProps,
                      route
                    })
              )}
            </SceneView>
          ))}
        </AnimatedPagerView>
      </View>
    </TabsViewContextProvider>
  )
})

export default TabsView
