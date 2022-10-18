import type { FC } from 'react'

import shallow from 'zustand/shallow'

import tw from '../../tailwind'
import { useAppStore } from '../../store'

import SafeAreaView from '../../components/safe-area-view'

import Header from './Header'

type Props = {}

const Home: FC<Props> = (props) => {
  const [navigationContainer] = useAppStore(
    (s) => [s.navigationContainer],
    shallow
  )

  return (
    <SafeAreaView
      enablePageMargin
      edges={['top']}
    >
      <Header />
    </SafeAreaView>
  )
}

export default Home
