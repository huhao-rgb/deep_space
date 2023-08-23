import type { FC } from 'react'

import { Text } from 'react-native'
import Animated from 'react-native-reanimated'

import tw from '../../tailwind'

const Player: FC = () => {
  return (
    <Animated.View style={tw`h-20 bg-gray-100`}>
      <Text>测试播放器控件</Text>
    </Animated.View>
  )
}

export default Player
