import type { ReactNode } from 'react'

import type { LayoutChangeEvent } from 'react-native'
import type {
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native'
import type { SharedValue } from 'react-native-reanimated'

export interface Route {
  key: string
  title?: string
  accessible?: boolean
  accessibilityLabel?: string
  testID?: string
}

export interface SceneRendererProps {
  position: SharedValue<number>
  jumpTo: (key: string) => void
}

export type RouteProps<T extends Route> = { route: T }
export type RenderSceneProps<T extends Route> = SceneRendererProps & RouteProps<T>

export interface TabsViewProps <T extends Route> {
  routes: T[]
  initialPage?: number
  lazy?: boolean
  tabsBarScrollEnabled?: boolean
  style?: StyleProp<ViewStyle>
  tabsBarStyle?: StyleProp<ViewStyle>
  renderTabBar?: (props: TabBarProps) => ReactNode
  RenderScene: (props: RenderSceneProps<Route>) => ReactNode
}

export type TabBarProps = Pick<TabsViewProps<Route>,
  | 'routes'
  | 'tabsBarScrollEnabled'
  | 'tabsBarStyle'
> & {
  width?: number
  onTabPress: (key: string) => void
  onTabLongPress?: (key: string) => void
}

export type TabBarItemProps = {
  label: string
  keyExtractor: string
  index: number
  scrollEnabled: TabBarProps['tabsBarScrollEnabled']
  scrollPosition: SharedValue<number>
  onLayout: (e: LayoutChangeEvent) => void
  onPress: (key: TabBarItemProps['keyExtractor']) => void
  onLongPress?: (key: TabBarItemProps['keyExtractor']) => void
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
