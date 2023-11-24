import type { ReactNode } from 'react'

import type {
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native'

export interface NavBarProps {
  title?: string
  bgTransparent?: boolean
  style?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  contentStyle?: StyleProp<ViewStyle>
  backIconColor?: string
  renderTitle?: () => ReactNode
  renderRight?: () => ReactNode
  onPress?: () => void
}
