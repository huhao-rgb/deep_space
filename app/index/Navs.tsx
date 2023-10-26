import type { FC } from 'react'

import { View, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'

import Icon from '@/components/svg-icon'

import { tw } from '@/utils'

const navs = [
  { name: '每日推荐', icon: 'Calendar' },
  { name: '私人漫游', icon: 'Wander' },
  { name: '歌单', icon: 'SongList' },
  { name: '排行榜', icon: 'Ranking' },
  { name: 'MV', icon: 'Video' }
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
          <LinearGradient
            colors={[tw.color('red-300') as string, tw.color('red-600') as string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={tw`w-12 h-12 justify-center items-center rounded-2xl bg-red-500/90`}
          >
            <Icon
              name={nav.icon}
              fill={tw.color('white')}
              width={nav.icon === 'SongList' ? 31 : 34}
              height={nav.icon === 'SongList' ? 31 : 34}
            />
          </LinearGradient>
          <Text style={tw`mt-1 text-gray-600 text-sm`}>
            {nav.name}
          </Text>
        </RectButton>
      ))}
    </View>
  )
}

export default Navs
