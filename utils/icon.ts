import type {
  SvgProps,
  NumberProp
} from 'react-native-svg'
import type { ColorValue } from 'react-native'

import tw from './tailwind'

export interface SvgIconProps extends SvgProps {
  size?: NumberProp
}

type SvgSize = 'base' | 'sm' | 'lg' | 'xl'
type Theme = 'dark' | 'light'

export interface GetSvgPropsOptions extends SvgProps {
  theme?: Theme
  size?: SvgSize
  isOutline?: boolean
}

const sizeObj: Record<SvgSize, NumberProp> = {
  sm: 16,
  base: 20,
  lg: 24,
  xl: 28
}

const themeObj: Record<Theme, ColorValue | undefined> = {
  light: tw.color('slate-700'),
  dark: tw.color('slate-200')
}

export const getSvgProps = (options: GetSvgPropsOptions): SvgIconProps => {
  const {
    theme = 'light',
    size = 'base',
    isOutline = true,
    ...props
  } = options

  const svgSize = sizeObj[size]
  const svgColor = themeObj[theme]

  const svgProps = {
    size: svgSize,
    ...props
  }
  isOutline
    ? svgProps.color = svgColor
    : svgProps.fill = svgColor

  return svgProps
}