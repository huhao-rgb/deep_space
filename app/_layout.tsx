import { useEffect, useRef } from 'react'

import { Text } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import TrackPlayer from 'react-native-track-player'
import NetInfo from '@react-native-community/netinfo'

import { Stack } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'

import dayjs from 'dayjs'

import BottomPlayer, { type BottomPlayer as BottomPlayerRef } from '@/components/bottom-player'

import {
  tw,
  mmkvDefaultStorage
} from '../utils'
import { ANONYMOUS_TOKEN } from '@/constants'

import { useWyCloudApi } from '@/hooks'
import { useNetInfo } from '@/store'

TrackPlayer.registerPlaybackService(() => require('../service'))

const TAG = 'rootLog'

export default function RootLayout () {
  const player = useRef<BottomPlayerRef>()

  const [setIp, setNetInfoState] = useNetInfo((s) => [
    s.setIp,
    s.setNetInfoState
  ])

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
        // 页面刷新了三次
        if (isConnected) setIp()
      })

      ;(async () => {
        await TrackPlayer.setupPlayer()
      })()

      return () => {
        unsubscribeNetInfo()
      }
    },
    []
  )

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <Stack screenOptions={{ header: () => null }} />
      {/* <TouchableOpacity
        style={tw`mb-10`}
        onPress={() => { player.current?.openPlayer() }}
      >
        <Text style={tw`py-2 px-4`}>打开播放器</Text>
      </TouchableOpacity> */}
      {/* <BottomPlayer ref={player} /> */}
    </GestureHandlerRootView>
  )
}
