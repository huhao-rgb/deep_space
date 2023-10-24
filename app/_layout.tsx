import { useEffect, useRef } from 'react'

import { Text } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import TrackPlayer from 'react-native-track-player'

import { Stack } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'

import dayjs from 'dayjs'

import BottomPlayer, { type BottomPlayer as BottomPlayerRef } from '@/components/bottom-player'

import {
  tw,
  mmkvDefaultStorage,
  wyCloudCookieToJson
} from '../utils'
import { ANONYMOUS_TOKEN } from '@/constants'

import { useWyCloudApi } from '@/hooks'

// TrackPlayer.registerPlaybackService(() => require('../service'))

const TAG = 'rootLog'

export default function RootLayout () {
  const player = useRef<BottomPlayerRef>()

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
            const cookieJson = wyCloudCookieToJson(cookie.join(';'))
            const musicA = cookieJson['HTTPOnly, MUSIC_A']
            musicA && mmkvDefaultStorage.set(ANONYMOUS_TOKEN, `${musicA}@${dayjs().valueOf()}`)
          }
        })

      ;(async () => {
        // await TrackPlayer.setupPlayer()
      })()
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
