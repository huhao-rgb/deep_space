import type { FC } from 'react'

import { Text } from 'react-native'
import { TabScrollView } from '@showtime-xyz/tab-view'

import type { SceneProps } from './types'

const Home: FC<SceneProps> = (props) => {
  const { route } = props

  return (
    <TabScrollView index={route.index}>
      <Text>测试</Text>
      <Text>测试</Text>
      <Text>测试</Text>
      <Text>测试</Text>
      <Text>测试</Text>
      <Text>测试</Text>
      <Text>测试</Text>
      <Text>测试</Text>
      <Text>测试</Text>
      <Text>测试</Text>
      <Text>测试</Text>
      <Text>测试</Text>
      <Text>测试</Text>
    </TabScrollView>
  )
}

export default Home
