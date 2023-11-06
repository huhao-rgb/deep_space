import type { FC } from 'react'

import type { ViewStyle, StyleProp } from 'react-native'

import { BorderlessButton } from 'react-native-gesture-handler'

import { tw } from '@/utils'
import Icon from '../svg-icon'

interface ButtonIconProps {
  name: string
  size: number
  fill?: string
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}

const ButtonIcon: FC<ButtonIconProps> = (props) => {
  const { name, size, fill, style, onPress } = props

  return (
    <BorderlessButton
      style={[tw`p-1`, style]}
      onPress={onPress}
    >
      <Icon
        name={name}
        fill={fill}
        width={size}
        height={size}
      />
    </BorderlessButton>
  )
}

export default ButtonIcon
