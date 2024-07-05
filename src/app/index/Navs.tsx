import type { FC } from 'react'

import { View, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'

import { router } from 'expo-router'

import Icon from '@/components/svg-icon'

import { tw } from '@/utils'

const navs = [
  { name: '每日推荐', icon: 'Calendar', path: '' },
  { name: '私人漫游', icon: 'Wander', path: '' },
  { name: '歌单', icon: 'SongList', path: '/song-list/推荐歌单' },
  { name: '排行榜', icon: 'Ranking', path: '' },
  { name: 'MV', icon: 'Video', path: '' }
]

const Navs: FC = () => {
  return (
    <View style={tw`px-5 flex-row items-center justify-between`}>
      {navs.map((nav, i) => {
        const onPress = () => {
          const { path } = nav
          if (path) router.push(path as any)
        }

        return (
          <RectButton
            activeOpacity={0.8}
            key={`NavItem_${i}`}
            rippleColor={tw.color('red-50')}
            borderless={false}
            style={tw`flex-col items-center`}
            onPress={onPress}
          >
            <LinearGradient
              colors={[tw.color('red-400') as string, tw.color('red-600') as string]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={tw`w-12 h-12 justify-center items-center rounded-2xl bg-red-500/90`}
            >
              <Icon
                name={nav.icon}
                fill={tw.color('white')}
                size={nav.icon === 'SongList' ? 31 : 34}
              />
            </LinearGradient>
            <Text style={tw`mt-1 text-gray-600 text-sm`}>
              {nav.name}
            </Text>
          </RectButton>
        )
      })}
    </View>
  )
}

export default Navs
