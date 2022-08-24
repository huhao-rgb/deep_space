import type { FC } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from './screen/home'

const Stack = createNativeStackNavigator()

const Navigation: FC = () => {
  return (
    <Stack.Navigator screenOptions={{ header: () => null }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  )
}

export default Navigation
