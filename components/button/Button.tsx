import type { FC } from 'react'
import { useMemo } from 'react'

import { View, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

import type { ButtonProps, ButtonSize } from './types'

import { tw, getSvgProps } from '@/utils'

const textSizeStyleObj: Record<ButtonSize, string> = {
  sm: 'text-xs',
  base: 'text-sm',
  lg: 'text-base'
}
const containerPXStyle: Record<ButtonSize, string> = {
  sm: 'px-3',
  base: 'px-4',
  lg: 'px-6'
}
const containerPYStyle: Record<ButtonSize, string> = {
  sm: 'py-0.5',
  base: 'py-1',
  lg: 'py-1.5'
}

const Button: FC<ButtonProps> = (props) => {
  const {
    ghost,
    size = 'base',
    shape,
    style,
    iconProps = {},
    textStyle,
    children,
    renderIcon,
    onPress
  } = props

  const containerStyle = useMemo(
    () => {
      return ghost
        ? tw`bg-transparent border border-red-500 border-solid`
        : tw`bg-red-500 border-transparent`
    },
    [ghost]
  )

  const roundedFullStyle = useMemo(
    () => tw`${shape === 'round' ? 'rounded-full' : 'rounded-md'}`,
    [shape]
  )

  return (
    <RectButton
      style={roundedFullStyle}
      onPress={onPress}
    >
      <View
        style={[
          tw`flex-row items-center border`,
          containerStyle,
          tw.style(
            containerPXStyle[size],
            containerPYStyle[size]
          ),
          roundedFullStyle,
          style
        ]}
      >
        {typeof renderIcon === 'function' &&
          renderIcon({
            ...getSvgProps({
              ...iconProps,
              theme: ghost ? 'light' : 'dark',
              size
            })
          })}
        <Text
          numberOfLines={1}
          style={[
            tw`${textSizeStyleObj[size]}`,
            tw`${ghost ? 'text-red-500' : 'text-white'}`,
            textStyle
          ]}
        >
          {children}
        </Text>
      </View>
    </RectButton>
  )
}

export default Button
