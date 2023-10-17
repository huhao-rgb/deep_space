import type { ReactNode } from 'react'

import type { LayoutChangeEvent } from 'react-native'
import type {
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import type { PagerViewProps } from 'react-native-pager-view'

export interface Route {
  key: string
  title?: string
  accessible?: boolean
  accessibilityLabel?: string
  testID?: string
}

export type PagerProps = Omit<
  PagerViewProps,
  | 'children'
  | 'onPageScrollStateChanged'
  | 'onPageSelected'
  | 'onPageScroll'
>


export interface SceneRendererProps {
  position: SharedValue<number>
  jumpTo: (key: string) => void
}

export type RouteProps<T extends Route> = { route: T }
export type RenderSceneProps<T extends Route> = SceneRendererProps & RouteProps<T>


export type KeyExtractor = string

export type TabBarProps<T extends Route> = SceneRendererProps & {
  routes: T[]
  scrollEnabled?: boolean
  labelStyle?: StyleProp<TextStyle>
  tabStyle?: StyleProp<ViewStyle>
  width: number
  onTabPress?: (key: KeyExtractor) => void
  onTabLongPress?: (key: KeyExtractor) => void
}

export interface TabsViewProps <T extends Route> extends PagerProps {
  routes: T[]
  lazy?: boolean
  labelStyle?: StyleProp<TextStyle>
  tabStyle?: StyleProp<ViewStyle>
  width: number
  tabsBarScrollEnabled?: boolean
  style?: StyleProp<ViewStyle>
  renderLazyPlaceholder?: (props: RouteProps<T>) => React.ReactNode
  renderTabBar?: (props: TabBarProps<T>) => ReactNode
  renderScene: (props: RenderSceneProps<Route>) => ReactNode
}

export interface TabBarItemProps {
  label: string
  keyExtractor: KeyExtractor
  index: number
  labelStyle?: StyleProp<TextStyle>
  scrollEnabled: TabBarProps<Route>['scrollEnabled']
  scrollPosition: SharedValue<number>
  onLayout: (e: LayoutChangeEvent) => void
  onPress?: (key: KeyExtractor) => void
  onLongPress?: (key: KeyExtractor) => void
}

export interface ItemsLayout {
  width: number
  x: number
}

export interface TabBarIndicatorProps {
  indicatorWidth?: number
  itemsLayout: ItemsLayout[]
}

export interface SceneViewProps {
  lazy: boolean
  index: number
  children: (props: { loading: boolean }) => ReactNode
}

export interface TabsViewContext {
  scrollPosition: SharedValue<number>
  currentPage: SharedValue<number>
}
