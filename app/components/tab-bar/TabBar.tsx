// https://reactnavigation.org/docs/bottom-tab-navigator
import type { FC } from 'react'

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Animated from 'react-native-reanimated'

import tw from '@/tailwind'

import Route from './Route'
import PlatformPressable from '../platform-pressable'
import SafeAreaView from '../safe-area-view'

const TabBar: FC<BottomTabBarProps> = (props) => {
  const {
    state,
    descriptors,
    navigation
  } = props

  return (
    <SafeAreaView
      edges={['bottom']}
      style={tw`bg-white dark:bg-slate-800`}
    >
      <Animated.View style={[tw.style('flex', 'flex-row', 'h-16')]}>
        {state.routes.map((route, i) => {
          const { options } = descriptors[route.key]
          const labelText =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name

          const isFocused = state.index === i

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            })

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate(route.name)
            }
          }

          return (
            <PlatformPressable
              key={`routez_${route.name}_i`}
              style={tw.style('flex-1')}
              testID={options.tabBarTestID}
              onPress={onPress}
            >
              <Route
                name={route.name}
                label={labelText as string}
                focus={isFocused}
              />
            </PlatformPressable>
          )
        })}
      </Animated.View>
    </SafeAreaView>
  )
}

export default TabBar
