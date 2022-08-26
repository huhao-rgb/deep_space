import type { FC } from 'react'
import { Text } from 'react-native'

import shallow from 'zustand/shallow'

import tw from '../../tailwind'
import { useApp } from '../../store'

import SafeAreaView from '../../components/safe-area-view'

type Props = {}

const Home: FC<Props> = (props) => {
  const [navigationContainer] = useApp(
    (s) => [s.navigationContainer],
    shallow
  )

  return (
    <SafeAreaView>
      <Text>测试home1</Text>
    </SafeAreaView>
  )
}

export default Home
