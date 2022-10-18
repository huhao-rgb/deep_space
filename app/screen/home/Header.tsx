import type { FC } from 'react'
import {
  View,
  Text
} from 'react-native'

import tw from '../../tailwind'

import PlatformPressable from '../../components/platform-pressable'
import { Icon } from '@/components/svg-icon'

type Props = {}

const Header: FC<Props> = (props) => {
  const onSearch = () => {
    console.log('search')
  }

  return (
    <View style={tw.style('flex', 'flex-row', 'justify-between', 'items-center')}>
      <View style={tw.style('flex', 'flex-row', 'items-center')}>
        <PlatformPressable style={tw.style('mr-2')}>
          <View style={tw.style('w-11', 'h-11', 'bg-gray-100', 'rounded-full')}>

          </View>
        </PlatformPressable>
        <View>
          <Text style={tw.style('text-gray-800', 'text-lg', 'font-bold')}>深空场</Text>
          <Text style={tw.style('text-sm', 'text-gray-500')}>DeepSpace</Text>
        </View>
      </View>
      <PlatformPressable onPress={onSearch}>
        <View style={tw.style('p-2', 'rounded-full', 'border-gray-200', 'border-solid', 'border')}>
          <Icon
            name="Search"
            width='16'
            height='16'
            viewBox='0 0 1024 1024'
          />
        </View>
      </PlatformPressable>
    </View>
  )
}

export default Header
