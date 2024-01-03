import type { FC } from 'react'

import Animated from 'react-native-reanimated'

const Toast: FC = () => {
  return (
    <Animated.View
      pointerEvents="box-none"
    ></Animated.View>
  )
}

export default Toast
