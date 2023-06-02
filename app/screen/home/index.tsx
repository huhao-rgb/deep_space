import type { FC } from 'react'
import { useEffect } from 'react'

import { useFetch } from '@/hooks'

import SafeAreaView from '@/components/safe-area-view'

import type { BottomTabsScreenProps } from '@/types'

import Header from './Header'
import HomeBody from './Body'

const Home: FC<BottomTabsScreenProps<'Home'>> = () => {
  const [api] = useFetch({ url: '我是url' })

  useEffect(() => {
    api()
      .then(res => { console.log(res) })
      .catch(error => {
        console.log(error)
      })
  }, [api])

  return (
    <SafeAreaView edges={['top']}>
      <Header />
      <HomeBody />
    </SafeAreaView>
  )
}

export default Home
