import type { FC } from 'react'
import { useEffect } from 'react'

import { shallow } from 'zustand/shallow'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { useDeviceContext, useAppColorScheme } from 'twrnc'

import tw from './tailwind'

import { useAppStore } from '@/store'

import Navigation from './Navigation'
import Player from './screen/player'

const App: FC = () => {
  const [
    theme,
    withDeviceColorScheme
  ] = useAppStore(
    (s) => [
      s.theme,
      s.withDeviceColorScheme
    ],
    shallow
  )

  useDeviceContext(tw, { withDeviceColorScheme })
  const [colorScheme, toggleColorScheme] = useAppColorScheme(tw)

  useEffect(
    () => {
    },
    [withDeviceColorScheme, theme, colorScheme]
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <NavigationContainer>
          <Navigation />
          <Player />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
