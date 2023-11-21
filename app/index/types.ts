import type { ReactNode, ReactElement } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface CardProps {
  text?: string
  showMoreText?: boolean
  moreText?: string
  style?: StyleProp<ViewStyle>
  headStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  renderHeadLeftTextEle?: () => ReactElement | null // 头部文字后面的内容，可以放一个小的icon
  children?: ReactNode
  onPress?: () => void
}
