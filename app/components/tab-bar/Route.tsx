import { FC, useEffect } from 'react'
import type { StyleProp, ViewProps } from 'react-native'
import { View } from 'react-native'

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
  name: string
  focus: boolean
  style?: StyleProp<ViewProps>
}

const FOCUS_COLOR = tw.color('red-500') as string
const BLUR_COLOR = tw.color('black') as string

const FOUCS_TRANSLATE = 8
const BLUR_TRANSLATE = 4

const getTabBarIcon = (name: string) => {
  return (
    <Icon
      name='Home'
      width='25'
      height='25'
    />
  )
}

const Route: FC<Props> = (props) => {
  const { label, name, focus, style } = props

  const color = focus ? FOCUS_COLOR : BLUR_COLOR

  const labelColor = useSharedValue(color)
  const animatedLableColorStyle = useAnimatedStyle(() => ({
    color: labelColor.value
  }))

  const iconBgOpacity = useSharedValue(0)
  const iconBgTranslateX = useSharedValue(BLUR_TRANSLATE)
  const iconBgTranslateY = useSharedValue(BLUR_TRANSLATE)
  const iconBgStyle = useAnimatedStyle(() => ({
    opacity: iconBgOpacity.value,
    transform: [
      { translateX: iconBgTranslateX.value },
      { translateY: iconBgTranslateY.value }
    ]
  }))

  useEffect(
    () => {
      cancelAnimation(labelColor)
      labelColor.value = withSpring(color)

      const activeTranslateValue = focus ? FOUCS_TRANSLATE : BLUR_TRANSLATE
      iconBgOpacity.value = withSpring(focus ? 1 : 0)
      iconBgTranslateX.value = withSpring(activeTranslateValue)
      iconBgTranslateY.value = withSpring(activeTranslateValue)
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
      <View>
        <View style={tw.style('z-10')}>
          {getTabBarIcon(name)}
        </View>
        <Animated.View style={[tw.style('absolute', 'w-4', 'h-4', 'rounded-full', 'bg-red-500'), iconBgStyle]} />
      </View>
      <Animated.Text
        style={[
          animatedLableColorStyle,
          tw.style('mt-0.5', 'text-sm')
        ]}
      >{label}</Animated.Text>
    </Animated.View>
  )
}

export default Route
