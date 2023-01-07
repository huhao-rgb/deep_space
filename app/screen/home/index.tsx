import { type FC, useEffect } from 'react'

import shallow from 'zustand/shallow'

import { useAppStore } from '@/store'

import SafeAreaView from '@/components/safe-area-view'

import Header from './Header'
import HomeBody from './Body'

import { useFetch } from '@/hooks'

type Props = {}

const Home: FC<Props> = (props) => {
  const [navigationContainer] = useAppStore(
    (s) => [s.navigationContainer],
    shallow
  )

  const [api] = useFetch({ url: '我是url' })

  useEffect(() => {
    api().then(res => { console.log(res) })
  }, [])

  return (
    <SafeAreaView edges={['top']}>
      <Header />
      <HomeBody />
    </SafeAreaView>
  )
}

export default Home
