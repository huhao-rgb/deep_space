import type { FC } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import TabBar from './components/tab-bar'

import HomePage from './screen/home-page'
import My from './screen/my'

import type { BottomTabsParamsList } from '@/types'

const Tab = createBottomTabNavigator<BottomTabsParamsList>()

const TabNavigator: FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{ header: () => null }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen
        name='HomePage'
        options={{ title: '首页' }}
        component={HomePage}
      />
      <Tab.Screen
        name='My'
        options={{ title: '我的' }}
        component={My}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
