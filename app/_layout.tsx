import { useEffect } from 'react'

import Animated from 'react-native-reanimated'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import TrackPlayer from 'react-native-track-player'
import NetInfo from '@react-native-community/netinfo'

import { Stack } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'

import dayjs from 'dayjs'

import BottomPlayer from '@/components/bottom-player'

import {
  tw,
  mmkvDefaultStorage
} from '@/utils'
import { ANONYMOUS_TOKEN } from '@/constants'

import { useWyCloudApi } from '@/hooks'
import { useNetInfo, usePlayer } from '@/store'

TrackPlayer.registerPlaybackService(() => require('../service'))

const TAG = 'rootLog'

export default function RootLayout () {
  const [miniPlayerRef] = usePlayer((s) => [s.miniPlayerRef])
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
      <Animated.View style={[tw`flex-1`]}>
        <Stack screenOptions={{ header: () => null }} />
      </Animated.View>
      {/* <TouchableOpacity
        style={tw`mb-10`}
        onPress={() => { player.current?.openPlayer() }}
      >
        <Text style={tw`py-2 px-4`}>打开播放器</Text>
      </TouchableOpacity> */}
      <BottomPlayer ref={miniPlayerRef} />
    </GestureHandlerRootView>
  )
}
