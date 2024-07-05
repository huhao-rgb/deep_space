import type { FC, ReactElement } from 'react'
import { isValidElement } from 'react'

import type { ViewStyle, StyleProp } from 'react-native'

import { BorderlessButton } from 'react-native-gesture-handler'

import { tw } from '@/utils'
import type { SvgIconProps } from '@/utils'

interface ButtonIconProps extends SvgIconProps {
  icon: (props: SvgIconProps) => ReactElement
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}

const ButtonIcon: FC<ButtonIconProps> = (props) => {
  const {
    icon,
    style,
    onPress,
    ...svgProps
  } = props

  return (
    <BorderlessButton
      style={[tw`p-1`, style]}
      onPress={onPress}
    >
      {icon({ ...svgProps })}
    </BorderlessButton>
  )
}

export default ButtonIcon
