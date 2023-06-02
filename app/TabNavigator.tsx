import type { FC } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import TabBar from './components/tab-bar'

import Home from './screen/home'
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
        name='Home'
        options={{ title: '首页' }}
        component={Home}
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
