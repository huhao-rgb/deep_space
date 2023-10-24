import type { FC } from 'react'

import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

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
        <TouchableOpacity
          activeOpacity={0.8}
          key={`NavItem_${i}`}
          style={tw`flex-col items-center`}
        >
          <View style={tw`w-12 h-12 rounded-md bg-gray-100`} />
          <Text style={tw`mt-2 text-gray-600 text-sm`}>
            {nav.name}
            </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default Navs
