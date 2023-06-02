import type { FC } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { useDeviceContext } from 'twrnc'

import tw from './tailwind'

import Navigation from './Navigation'
import Player from './screen/player'

const App: FC = () => {
  useDeviceContext(tw, { withDeviceColorScheme: false })

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
