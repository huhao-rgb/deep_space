// https://reactnavigation.org/docs/bottom-tab-navigator
import type { FC } from 'react'
import {
  View,
  Text
} from 'react-native'

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Animated from 'react-native-reanimated'
import { Shadow } from 'react-native-shadow-2'

import tw from '../../tailwind'

import Route from './Route'
import PlatformPressable from '../platform-pressable'

type Props = {} & BottomTabBarProps

const TabBar: FC<Props> = (props) => {
  const {
    state,
    descriptors,
    insets,
    navigation
  } = props

  return (
    <View
      style={tw.style(
        'px-4',
        { paddingBottom: insets?.bottom }
      )}
    >
      <Shadow
        startColor={tw.color('gray-100')}
        distance={15}
        style={tw.style('w-full')}
      >
        <Animated.View style={[tw.style('flex', 'flex-row', 'h-18', 'rounded-xl', 'bg-white')]}>
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
      </Shadow>
    </View>
  )
}

export default TabBar
