import { useEffect, useRef } from 'react'

import { Text } from 'react-native'
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler'
import TrackPlayer from 'react-native-track-player'

import { Stack } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'

import BottomPlayer, { type BottomPlayer as BottomPlayerRef } from '@/components/bottom-player'

import { tw } from '../utils'

// TrackPlayer.registerPlaybackService(() => require('../service'))

export default function RootLayout () {
  const player = useRef<BottomPlayerRef>()

  useEffect(
    () => {
      NavigationBar.setPositionAsync('absolute')
      NavigationBar.setBackgroundColorAsync('#ffffff00')

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
