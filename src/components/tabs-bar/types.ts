import type { ReactNode } from 'react'
import type {
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native'
import type {
  SceneRendererProps,
  NavigationState,
  Route
} from 'react-native-tab-view'

export type RenderTabBarProps <T extends Route> = SceneRendererProps & { navigationState: NavigationState<T> }

export interface RenderTabsBarItemProps <T extends Route = any> {
  route: T
  index: number
  keyExtractor: string
  scrollEnabled: boolean
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  onLayout?: (event: LayoutChangeEvent) => void
  onTabBarItemPress?: () => void
  onTabsBarItemLongPress?: () => void
}

export interface TabsBarProps <T extends Route = any> extends RenderTabBarProps<T> {
  scrollEnabled?: boolean
  style?: StyleProp<ViewStyle>
  tabsBarItemStyle?: StyleProp<ViewStyle>
  renderTabsBarItem?: (props: RenderTabsBarItemProps<T>) => ReactNode
}
