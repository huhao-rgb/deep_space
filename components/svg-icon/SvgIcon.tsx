import type { FC } from 'react'
import { cloneElement, isValidElement } from 'react'

import { Svg } from 'react-native-svg'

import { tw } from '@/utils'

import { SvgIconProps } from './types'

const SvgIcon: FC<SvgIconProps> = (props) => {
  const {
    name,
    svgs,
    height = '44',
    width = '44',
    fill = tw.color('gray-900'),
    viewBox,
    fillRule = 'evenodd',
    stroke,
    strokeWidth,
    ...rest
  } = props

  if (!name || !svgs[name]) return null

  const svg = svgs[name]
  const isReactElement = isValidElement(svg)
  const svgElement = isReactElement ? svg : svg?.svg

  const defaultViewBox = viewBox ||
    isReactElement
    ? '0 0 100 100'
    : svg.viewBox

  return (
    <Svg
      width={width}
      height={height}
      viewBox={defaultViewBox}
      {...rest}
    >
      {cloneElement(svgElement, {
        fill,
        fillRule,
        stroke,
        strokeWidth
      })}
    </Svg>
  )
}

export default SvgIcon
