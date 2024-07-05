import type { FC } from 'react'

import SvgIcon from './SvgIcon'
import icons from '@/assets/icons'

import type { IconProps } from './types'

const Icon: FC<IconProps> = (props) => {
  const {
    name,
    size = 44,
    ...rest
  } = props

  return (
    <SvgIcon
      name={name}
      width={size}
      height={size}
      svgs={icons}
      {...rest}
    />
  )
}

export default Icon
