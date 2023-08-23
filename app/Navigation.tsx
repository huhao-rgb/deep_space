import type { FC } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import type { RootStackParamList } from '@/types'

// pages
import HomePage from './screen/home-page'
import My from './screen/my'
import Search from './screen/search'

const Stack = createNativeStackNavigator<RootStackParamList>()

const Navigation: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{ header: () => null }}
    >
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="My" component={My} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  )
}

export default Navigation
