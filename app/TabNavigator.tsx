import type { FC } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import TabBar from './components/tab-bar'

import Home from './screen/home'
import My from './screen/my'

const Tab = createBottomTabNavigator()

const TabNavigator: FC = (props) => {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => null,
        tabBarStyle: {
          position: "absolute"
        }
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        options={{ title: "首页" }}
        component={Home}
      />
      <Tab.Screen
        name="My"
        options={{ title: "我的" }}
        component={My}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
