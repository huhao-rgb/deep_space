import type { FC } from 'react'
import { useEffect } from 'react'
import { View } from 'react-native'

import { useFetch } from '@/hooks'
import tw from '@/tailwind'

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
    <View style={tw.style('flex-1')}>
      <Header />
      <HomeBody />
    </View>
  )
}

export default Home
