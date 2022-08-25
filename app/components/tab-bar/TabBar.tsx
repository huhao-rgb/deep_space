import type { FC } from 'react'
import {
  View,
  Text
} from 'react-native'

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import tw from '../../tailwind'

type Props = {} & BottomTabBarProps

const TabBar: FC<Props> = (props) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={tw.style(
        'px-4',
        { paddingBottom: insets?.bottom }
      )}
    >
      <Text>123</Text>
    </View>
  )
}

export default TabBar
