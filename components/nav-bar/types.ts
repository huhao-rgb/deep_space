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
  backIconColor?: string
  renderTitle?: () => ReactNode
}
