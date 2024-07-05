/**
 * 自定义进入布局动画
 * 详细参考react-native-reanimated布局动画文档
 * https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/custom-animations
 */
import { withTiming, Easing } from 'react-native-reanimated'
import type {
  LayoutAnimation,
  LayoutAnimationsValues
} from 'react-native-reanimated'

const DEFAULT_DURATION = 230

const bezierEasing = Easing.bezier(0.21, 1.02, 0.73, 1)

export const AmplifiedInUp = (targetValues: LayoutAnimationsValues): LayoutAnimation => {
  'worklet'
  const animations = {
    originY: withTiming(
      targetValues.targetOriginY,
      {
        duration: DEFAULT_DURATION,
        easing: bezierEasing
      }
    ),
    transform: [
      {
        scale: withTiming(
          1,
          {
            duration: DEFAULT_DURATION,
            easing: bezierEasing
          }
        )
      }
    ]
  }

  const initialValues = {
    originY: -targetValues.targetHeight,
    transform: [{ scale: 0.8 }]
  }

  return {
    animations,
    initialValues
  }
}

export const AmplifiedOutUp = (targetValues: LayoutAnimationsValues): LayoutAnimation => {
  'worklet'
  const animations = {
    originY: withTiming(
      -targetValues.currentHeight,
      {
        duration: DEFAULT_DURATION,
        easing: bezierEasing
      }
    ),
    transform: [
      {
        scale: withTiming(
          0.9,
          {
            duration: DEFAULT_DURATION,
            easing: bezierEasing
          }
        )
      }
    ]
  }

  const initialValues = {
    originY: targetValues.currentOriginY,
    transform: [{ scale: 1 }]
  }

  return {
    animations,
    initialValues
  }
}
