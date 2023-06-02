import type { FC } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import TabNavigator from './TabNavigator'

import type { RootStackParamList } from '@/types'

// pages
import Search from './screen/search'

const Stack = createNativeStackNavigator<RootStackParamList>()

const Navigation: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{ header: () => null }}
    >
      <Stack.Screen name="TabNavigation" component={TabNavigator} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  )
}

export default Navigation
