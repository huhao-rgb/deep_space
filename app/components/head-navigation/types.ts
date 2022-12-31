import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type HeadNavationProps = {
  style?: StyleProp<ViewStyle>
  title?: string
  leftIcon?: () => ReactNode
  rightIcon?: () => ReactNode
}
