import { useEffect } from 'react'

import { shallow } from 'zustand/shallow'

import { useAppStore } from '@/store'
import { useFetch } from '@/hooks'

import SafeAreaView from '../../components/safe-area-view'

import Header from './Header'
import HomeBody from './Body'

const Home = () => {
  const [navigationContainer] = useAppStore(
    (s) => [s.navigationContainer],
    shallow
  )

  const [api] = useFetch({ url: '我是url' })

  useEffect(() => {
    api().then(res => { console.log(res) }).catch(error => {})
  }, [api])

  return (
    <SafeAreaView edges={['top']}>
      <Header />
      <HomeBody />
    </SafeAreaView>
  )
}

export default Home
