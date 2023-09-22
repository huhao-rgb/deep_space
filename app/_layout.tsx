import { useEffect } from 'react'

import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { Stack } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'

import { tw } from '../utils'

export default function RootLayout () {
  useEffect(
    () => {
      NavigationBar.setPositionAsync('absolute')
      NavigationBar.setBackgroundColorAsync('#ffffff00')
    },
    []
  )

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <Stack screenOptions={{ header: () => null }} />
    </GestureHandlerRootView>
  )
}
