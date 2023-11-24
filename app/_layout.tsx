import { useEffect } from 'react'

import { shallow } from 'zustand/shallow'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import NetInfo from '@react-native-community/netinfo'

import { Stack } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'

import dayjs from 'dayjs'

import BottomPlayer from '@/components/bottom-player'
import Player from '@/components/player'
import PlaceholderBlock from '@/components/placeholder-block'
import BottomPlayerQueue from '@/components/bottom-player-queue'
import InitRntp from '@/components/init-rntp'

import {
  tw,
  mmkvDefaultStorage
} from '@/utils'
import { ANONYMOUS_TOKEN } from '@/constants'

import { useWyCloudApi } from '@/hooks'
import { useNetInfo } from '@/store'

export default function RootLayout () {
  const [setNetInfoState, setIp] = useNetInfo(
    (s) => [s.setNetInfoState, s.setIp],
    shallow
  )

  const wyCloud = useWyCloudApi('registerAnonimous', 1000 * 60 * 60 * 24)

  useEffect(
    () => {
      NavigationBar.setPositionAsync('absolute')
      NavigationBar.setBackgroundColorAsync('#ffffff00')

      wyCloud()
        .then(response => {
          const { status, body, cookie } = response
          if (
            status === 200 &&
            body.code === 200 &&
            cookie[0]
          ) {
            const cookies = cookie[0].replace(/Domain=.music.163.com, /g, '').split(';')
            if (cookies.length > 0) {
              const cookieJson: Record<string, any> = {}

              cookies.forEach(item => {
                const trimStr = item.trim()
                const strToArray = trimStr.split('=')
                cookieJson[strToArray[0]] = strToArray[1]
              })
              
              const musicA = cookieJson['MUSIC_A']
              musicA && mmkvDefaultStorage.set(ANONYMOUS_TOKEN, `${musicA}@${dayjs().valueOf()}`)
            }
          }
        })
      
      const unsubscribeNetInfo = NetInfo.addEventListener(state => {
        const { type, isConnected } = state
        setNetInfoState(type)
        // if (isConnected) setIp()
      })

      return () => {
        unsubscribeNetInfo()
      }
    },
    []
  )

  console.log('刷新次数')

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <Stack
        screenOptions={{
          header: () => null,
          contentStyle: tw`bg-white`
        }}
      />
      {/* 占位块，用于弹出mini播放器后撑开页面 */}
      <PlaceholderBlock />
      <BottomPlayer />
      <Player />
      <BottomPlayerQueue />
      <InitRntp />
    </GestureHandlerRootView>
  )
}
