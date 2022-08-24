import type { FC } from 'react'
import { useEffect } from 'react'

import {
  NavigationContainer,
  useNavigationContainerRef
} from '@react-navigation/native'

import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useDeviceContext } from 'twrnc'

import tw from './tailwind'

import Navigation from './Navigation'

import shallow from 'zustand/shallow'
import { useApp } from './store'

const App: FC = () => {
  useDeviceContext(tw, { withDeviceColorScheme: false })

  const navigationContainerRef = useNavigationContainerRef()

  const [setNavigationContainer] = useApp(
    (s) => [s.setNavigationContainer],
    shallow
  )

  useEffect(
    () => {
      navigationContainerRef && setNavigationContainer(navigationContainerRef)
    },
    [navigationContainerRef]
  )

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationContainerRef}>
        <Navigation />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App
