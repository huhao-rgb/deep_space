import type { ReactNode } from 'react'

import type {
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native'

import type { SvgIconProps } from '@/utils'

export type ButtonSize = 'sm' | 'base' | 'lg'

export interface RenderIconProps extends SvgIconProps {}

export interface ButtonProps {
  ghost?: boolean
  shape?: 'default' | 'round'
  size?: ButtonSize
  iconProps?: SvgIconProps
  children?: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  renderIcon?: (props: RenderIconProps) => ReactNode
  onPress?: () => void
}
