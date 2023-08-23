import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type Route = {
  key: string
}

export interface RenderScreenProps {
  route: Route
}

export interface PageScrollViewProps {
  routes: Route[]
  paddingHorizontal?: number // 容器的左右边距
  offset?: number // 每个页面距离右侧的边距，建议和paddingHorizontal设置一样，默认为tw.style('w-5')
  width?: number // 容器的总宽度，默认为屏幕宽度
  style?: StyleProp<ViewStyle>
  routeStyle?: StyleProp<ViewStyle>
  RenderScreen: (props: RenderScreenProps) => ReactNode
}

export interface RouteProps {
  width: number
  offset: number
  children: ReactNode
  style?: PageScrollViewProps['routeStyle']
}
