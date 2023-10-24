import type { FC } from 'react'

import { View, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

import { tw } from '@/utils'

const navs = [
  { name: '每日推荐', icon: '' },
  { name: '私人漫游', icon: '' },
  { name: '歌单', icon: '' },
  { name: '排行榜', icon: '' },
  { name: '每日推荐', icon: '' }
]

const Navs: FC = () => {
  return (
    <View style={tw`px-5 mb-8 flex-row items-center justify-between`}>
      {navs.map((nav, i) => (
        <RectButton
          activeOpacity={0.8}
          key={`NavItem_${i}`}
          rippleColor={tw.color('red-50')}
          borderless={false}
          style={tw`flex-col items-center`}
        >
          <View style={tw`w-12 h-12 rounded-md bg-red-400`} />
          <Text style={tw`mt-2 text-gray-600 text-sm`}>
            {nav.name}
          </Text>
        </RectButton>
      ))}
    </View>
  )
}

export default Navs
