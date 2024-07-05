import type {
  SvgProps,
  NumberProp
} from 'react-native-svg'
import type { ColorValue } from 'react-native'

import tw from './tailwind'

export interface SvgIconProps extends SvgProps {
  size?: NumberProp
}

type SvgSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'
type Theme = 'dark' | 'light'

export interface GetSvgPropsOptions extends SvgProps {
  theme?: Theme
  size?: SvgSize | number
  isOutline?: boolean
}

const sizeObj: Record<SvgSize, NumberProp> = {
  xs: 12,
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
    fill,
    color,
    ...props
  } = options

  const svgSize = typeof size === 'number'
    ? size
    : sizeObj[size]
  const svgColor = themeObj[theme]

  const svgProps: SvgIconProps = {
    size: svgSize,
    ...props
  }

  const fillColorValue = fill ?? ((!isOutline && svgColor ) || undefined)
  const colorValue = color ?? ((isOutline && svgColor) || undefined)

  if (fillColorValue) svgProps.fill = fillColorValue
  if (colorValue) svgProps.color = colorValue

  return svgProps
}