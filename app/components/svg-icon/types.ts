import React from 'react'
import type { SvgProps } from 'react-native-svg'

export type SvgObject = {
  [key: string]: React.ReactElement
}

export type SvgIconProps = {
  name: string
  svgs: SvgObject
} & SvgProps

export type IconProps = Omit<SvgIconProps, 'svgs'>
