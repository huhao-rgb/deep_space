import type { FC } from 'react'

import SvgIcon from './SvgIcon'
import icons from '@/assets/icons'

import type { IconProps } from './types'

const Icon: FC<IconProps> = (props) => {
  const { name, ...rest } = props

  return (
    <SvgIcon
      name={name}
      svgs={icons}
      {...rest}
    />
  )
}

export default Icon
