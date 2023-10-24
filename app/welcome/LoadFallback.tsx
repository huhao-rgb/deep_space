import type { FC } from 'react'

import { View, Text } from 'react-native'

const LoadFallback: FC = () => {
  return (
    <View>
      <Text>加载中....</Text>
      <Text>加载中....</Text>
      <Text>加载中....</Text>
      <Text>加载中....</Text>
      <Text>加载中....</Text>
    </View>
  )
}

export default LoadFallback
