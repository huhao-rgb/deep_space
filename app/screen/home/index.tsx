import type { FC } from 'react'

import shallow from 'zustand/shallow'

import { useAppStore } from '@/store'

import SafeAreaView from '@/components/safe-area-view'

import Header from './Header'
import HomeBody from './Body'

type Props = {}

const Home: FC<Props> = (props) => {
  const [navigationContainer] = useAppStore(
    (s) => [s.navigationContainer],
    shallow
  )

  return (
    <SafeAreaView edges={['top']}>
      <Header />
      <HomeBody />
    </SafeAreaView>
  )
}

export default Home
