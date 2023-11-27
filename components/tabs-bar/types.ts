import type { ReactNode } from 'react'
import type {
  StyleProp,
  ViewStyle
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
  style?: StyleProp<ViewStyle>
}

export interface TabsBarProps <T extends Route = any> extends RenderTabBarProps<T> {
  scrollEnabled?: boolean
  style?: StyleProp<ViewStyle>
  tabsBarItemStyle?: StyleProp<ViewStyle>
  renderTabsBarItem?: (props: RenderTabsBarItemProps<T>) => ReactNode
}
