import type { FC } from 'react'
import {
  View,
  Text
} from 'react-native'

import { useNavigation } from '@react-navigation/native'

import tw from '@/tailwind'

import PlatformPressable from '@/components/platform-pressable'
import SafeAreaView from '@/components/safe-area-view'
import { Icon } from '@/components/svg-icon'

import type { BottomTabsNavigationProps } from '@/types'

const Header: FC = () => {
  const navigation = useNavigation<BottomTabsNavigationProps<'Home'>>()

  const onSearch = () => {
    navigation.navigate('Search')
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={tw`bg-white dark:bg-slate-900`}
    >
      <View style={tw.style('py-2', 'px-5', 'flex', 'flex-row', 'justify-between', 'items-center')}>
        <View style={tw.style('flex', 'flex-row', 'items-center')}>
          <PlatformPressable style={tw.style('mr-2')}>
            <View style={tw.style('w-11', 'h-11', 'bg-gray-100', 'rounded-full')}>

            </View>
          </PlatformPressable>
          <View>
            <Text style={tw`text-lg font-bold text-gray-800 dark:text-slate-400`}>深空场</Text>
            <Text style={tw`text-sm text-gray-500 dark:text-slate-500`}>DeepSpace</Text>
          </View>
        </View>
        <PlatformPressable onPress={onSearch}>
          <View style={tw.style('p-2', 'rounded-full', 'border-gray-200', 'border-solid', 'border')}>
            <Icon
              name="Search"
              width='16'
              height='16'
            />
          </View>
        </PlatformPressable>
      </View>
    </SafeAreaView>
  )
}

export default Header
