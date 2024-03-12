import type { FC } from 'react'
import {
  useState,
  useRef,
  useCallback
} from 'react'

import { View } from 'react-native'
import Animated, {
  runOnJS,
  withTiming,
  useSharedValue,
  useAnimatedReaction,
  useAnimatedStyle
} from 'react-native-reanimated'

import { useTabsViewContext } from './Context'
import type { SceneViewProps } from './types'

const SceneView: FC<SceneViewProps> = (props) => {
  const {
    lazy,
    index,
    children
  } = props

  const { currentPage } = useTabsViewContext()

  const mounted = useRef(false) // 加载完成
  const startMounted = currentPage.value === index

  const [canMount, setCanMount] = useState(!!startMounted)
  const opacity = useSharedValue<number>(startMounted ? 1 : 0)

  const allowToMount = useCallback(
    () => {
      if (!mounted.current) {
        setCanMount(true)
        mounted.current = true
      }

      if (opacity.value !== 1) {
        setTimeout(() => {
          opacity.value = withTiming(1)
        }, 50)
      }
    },
    [opacity]
  )

  useAnimatedReaction(
    () => currentPage.value === index,
    (focused) => {
      if (focused && !canMount) {
        runOnJS(allowToMount)()
      }
    },
    [currentPage]
  )

  const stylez = useAnimatedStyle(
    () => ({ opacity: opacity.value }),
    []
  )

  return (
    <View style={{ flex: 1 }}>
      {lazy
        ? canMount
          ? (
              <Animated.View style={[{ flex: 1 }, stylez]}>
                {children({ loading: false })}
              </Animated.View>
            )
          : children({ loading: true })
        : children({ loading: false })}
    </View>
  )
}

export default SceneView
