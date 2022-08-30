import { FC, useEffect } from 'react'
import type { StyleProp, ViewProps } from 'react-native'

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  cancelAnimation
} from 'react-native-reanimated'
import tw from '../../tailwind'

type Props = {
  label: string
  focus: boolean
  style?: StyleProp<ViewProps>
}

const FOCUS_COLOR = tw.color('red-500') as string
const BLUR_COLOR = tw.color('black') as string

const Route: FC<Props> = (props) => {
  const { label, focus, style } = props

  const labelColor = useSharedValue(focus ? FOCUS_COLOR : BLUR_COLOR)
  const animatedLableColorStyle = useAnimatedStyle(() => ({
    color: labelColor.value
  }))

  useEffect(
    () => {
      cancelAnimation(labelColor)
      console.log(FOCUS_COLOR, BLUR_COLOR)
      labelColor.value = withSpring(focus ? FOCUS_COLOR : BLUR_COLOR)
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
      <Animated.Text style={[animatedLableColorStyle]}>{label}</Animated.Text>
    </Animated.View>
  )
}

export default Route
