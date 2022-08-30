import { FC, useEffect } from 'react'
import type { StyleProp, ViewProps } from 'react-native'

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  cancelAnimation
} from 'react-native-reanimated'

import tw from '../../tailwind'
import { Icon } from '../svg-icon'

type Props = {
  label: string
  focus: boolean
  style?: StyleProp<ViewProps>
}

const FOCUS_COLOR = tw.color('red-500') as string
const BLUR_COLOR = tw.color('black') as string

const Route: FC<Props> = (props) => {
  const { label, focus, style } = props

  const color = focus ? FOCUS_COLOR : BLUR_COLOR

  const labelColor = useSharedValue(color)
  const animatedLableColorStyle = useAnimatedStyle(() => ({
    color: labelColor.value
  }))

  useEffect(
    () => {
      cancelAnimation(labelColor)
      labelColor.value = withSpring(color)
    },
    [focus]
  )
  return (
    <Animated.View
      style={[
        tw.style('flex', 'flex-col', 'justify-center', 'items-center', 'flex-1'),
        style
      ]}
    >
      <Icon
        name='Home'
        width='20'
        height='20'
        fill={color}
        viewBox='0 0 1024 1024'
      />
      <Animated.Text
        style={[
          animatedLableColorStyle,
          tw.style('m-1')
        ]}
      >{label}</Animated.Text>
    </Animated.View>
  )
}

export default Route
