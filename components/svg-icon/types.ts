import { ReactElement } from 'react'
import type { SvgProps } from 'react-native-svg'

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
} & SvgProps

export type IconProps = Omit<SvgIconProps, 'svgs'>
