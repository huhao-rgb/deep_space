import type { FC } from 'react'
import { cloneElement } from 'react'

import { Svg } from 'react-native-svg'

import tw from '../../tailwind'

import { SvgIconProps } from './types'

const SvgIcon: FC<SvgIconProps> = (props) => {
  const {
    name,
    svgs,
    height = '44',
    width = '44',
    fill = tw.color('gray-900'),
    viewBox = '0 0 100 100',
    fillRule = 'evenodd',
    stroke,
    strokeWidth,
    ...rest
  } = props

  if (!name || !svgs[name]) return null

  return (
    <Svg
      width={width}
      height={height}
      viewBox={viewBox}
      {...rest}
    >
      {cloneElement(svgs[name], {
        fill,
        fillRule,
        stroke,
        strokeWidth
      })}
    </Svg>
  )
}

export default SvgIcon
