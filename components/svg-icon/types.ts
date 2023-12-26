import { ReactElement } from 'react'
import type { SvgProps, NumberProp } from 'react-native-svg'

export type SvgOptions = {
  svg: ReactElement
  viewBox?: string
}

export type SvgObject = {
  [key: string]: SvgOptions | ReactElement
}

export type SvgIconProps = {
  name: string
  svgs: SvgObject
  size?: NumberProp
} & SvgProps

export type IconProps = Omit<SvgIconProps, 'svgs' | 'width' | 'height'>
