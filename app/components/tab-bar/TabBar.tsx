// https://reactnavigation.org/docs/bottom-tab-navigator
import type { FC } from 'react'
import { View, type LayoutChangeEvent } from 'react-native'

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Animated from 'react-native-reanimated'
import { Shadow } from 'react-native-shadow-2'

import tw from '@/tailwind'

import Route from './Route'
import PlatformPressable from '../platform-pressable'

import { shallow } from 'zustand/shallow'
import { useAppStore } from '@/store'

type Props = {} & BottomTabBarProps

const TabBar: FC<Props> = (props) => {
  const {
    state,
    descriptors,
    insets,
    navigation
  } = props

  const [setTabBarHeight] = useAppStore(
    (s) => [s.setTabBarHeight],
    shallow
  )

  const onTabBarLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setTabBarHeight(height + 15)
  }

  return (
    <View
      style={tw.style(
        'absolute',
        'bottom-2',
        'left-0',
        'right-0',
        'px-5',
        { paddingBottom: insets?.bottom }
      )}
      onLayout={onTabBarLayout}
    >
      <Shadow
        startColor={tw.color('gray-100')}
        distance={13}
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
