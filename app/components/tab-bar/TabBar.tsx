// https://reactnavigation.org/docs/bottom-tab-navigator
import type { FC } from 'react'
import {
  View,
  Text
} from 'react-native'

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Animated from 'react-native-reanimated'

import tw from '../../tailwind'

import Route from './Route'
import { TouchableHighlight } from 'react-native-gesture-handler'

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
        'h-20',
        { paddingBottom: insets?.bottom }
      )}
    >
      <Animated.View style={[tw.style('flex', 'flex-row', 'flex-1')]}>
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
            <TouchableHighlight
              key={`routez_${route.name}_i`}
              testID={options.tabBarTestID}
              style={tw.style('flex-1')}
              onPress={onPress}
            >
              <Route
                label={labelText as string}
                focus={isFocused}
              />
            </TouchableHighlight>
          )
        })}
      </Animated.View>
    </View>
  )
}

export default TabBar
