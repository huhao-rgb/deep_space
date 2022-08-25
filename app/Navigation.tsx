import type { FC } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import TabNavigator from './TabNavigator'

const Stack = createNativeStackNavigator()

const Navigation: FC = () => {
  return (
    <Stack.Navigator screenOptions={{ header: () => null }}>
      <Stack.Screen name="TabNavigation" component={TabNavigator} />
    </Stack.Navigator>
  )
}

export default Navigation
