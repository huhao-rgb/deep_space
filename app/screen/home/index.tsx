import type { FC } from 'react'
import { Text } from 'react-native'

import shallow from 'zustand/shallow'

import tw from '../../tailwind'

import { useApp } from '../../store'

type Props = {}

const Home: FC<Props> = (props) => {
  const [navigationContainer] = useApp(
    (s) => [s.navigationContainer],
    shallow
  )

  console.log(navigationContainer)

  return (
    <Text>测试home2</Text>
  )
}

export default Home
