import type { FC } from 'react'
import { useEffect } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import shallow from 'zustand/shallow'

import TabNavigator from './TabNavigator'

import { useApp } from './store'

const Stack = createNativeStackNavigator()

const Navigation: FC = () => {
  const insets = useSafeAreaInsets()

  const [setSafeAreaInsets] = useApp(
    (s) => [s.setSafeAreaInsets],
    shallow
  )

  useEffect(
    () => {
      if (insets) setSafeAreaInsets(insets)
    },
    [insets]
  )

  console.log(insets)
  
  return (
    <Stack.Navigator screenOptions={{ header: () => null }}>
      <Stack.Screen name="TabNavigation" component={TabNavigator} />
    </Stack.Navigator>
  )
}

export default Navigation
