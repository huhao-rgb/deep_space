import { type FC, useState } from 'react'
import {
  ScrollView,
  Text,
  View,
  useWindowDimensions
} from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'

import tw from '@/tailwind'

import { shallow } from 'zustand/shallow'
import { useAppStore } from '@/store'

import FootLoading from '@/components/foot-loading'

type CardProps = {
  title: string
  describe: string
  style?: StyleProp<ViewStyle>
}

type LabelItemProps = {
  name: string
}

type SongListItemProps = {
  name: string
  like: number
  style?: StyleProp<ViewStyle>
}

const labels = [
  { name: '每日推荐', key: 'mrtj', route: '' },
  { name: '私人FM', key: 'srfm', route: '' },
  { name: '歌单', key: 'gd', route: '' },
  { name: '排行榜', key: 'phb', route: '' }
]

const recommends = [
  { singer: 'The Lab Of Honur', song: 'The Striving', key: '1' },
  { singer: 'TSocially Buzzed', song: ' Enjoy', key: '2' },
  { singer: 'Initial Concepts', song: 'Closed Mondays', key: '3' }
]

const songList = [
  { name: 'Top 15 Rap', like: 115 },
  { name: 'Radio Mirchi', like: 112 },
  { name: 'SPB: Top50', like: 1.8 },
  { name: 'Hot Playlist', like: 14 },
  { name: 'The Striviong', like: 12.5 }
]

const Card: FC<CardProps> = (props) => {
  const { title, describe, style } = props

  const window = useWindowDimensions()
  const plWidth = tw.style('pl-5').paddingLeft as number

  const [cardWidth] = useState(() => window.width - plWidth - 40)

  return (
    <View
      style={[
        tw.style('flex-1', 'h-48', 'bg-gray-100', 'rounded-3xl', 'overflow-hidden'),
        { width: cardWidth },
        style
      ]}
    >
      <View style={tw.style('absolute', 'bottom-0', 'left-0', 'w-full', 'px-6', 'py-2', 'bg-gray-500')}>
        <Text style={tw.style('text-lg', 'text-white', 'font-bold')}>{title}</Text>
        <Text style={tw.style('text-sm', 'text-slate-200')}>{describe}</Text>
      </View>
    </View>
  )
}

const LableItem: FC<LabelItemProps> = (props) => {
  const { name } = props

  return (
    <View style={tw.style('flex', 'flex-col', 'justify-center', 'items-center')}>
      <View style={tw.style('w-14', 'h-14', 'rounded-2xl', 'bg-gray-100')}></View>
      <Text style={tw.style('mt-2', 'text-sm', 'text-gray-800')}>{name}</Text>
    </View>
  )
}

const Recommend = () => {
  return (
    <View style={tw.style('my-3', 'px-5')}>
      <View>
        <Text style={tw.style('text-lg')}>推荐给独特的你</Text>
      </View>
      <View>
        {recommends.map((recommend, i) => (
          <View key={recommend.key} style={tw.style('flex', 'flex-row', 'items-center', 'justify-between', 'mt-3')}>
            <View style={tw.style('flex', 'flex-row', 'items-center')}>
              <View style={tw.style('flex', 'flex-row', 'items-center')}>
                <View style={tw.style('w-24', 'h-20', 'rounded-3xl', 'bg-gray-100')}></View>
              </View>
              <View style={tw.style('ml-3')}>
                <Text style={tw.style('text-base', 'text-gray-800')}>{recommend.song}</Text>
                <Text style={tw.style('text-sm', 'text-gray-400')}>{recommend.singer}</Text>
              </View>
            </View>
            <View style={tw.style('w-10', 'h-10', 'rounded-full', 'bg-gray-100')}></View>
          </View>
        ))}
      </View>
    </View>
  )
}

const SongListItem: FC<SongListItemProps> = (props) => {
  const { name, like, style } = props

  return (
    <View style={[tw.style('flex', 'flex-col', 'justify-center', 'items-center', 'w-22'), style]}>
      <View style={[tw.style('w-22', 'flex', 'flex-col', 'items-center', 'relative')]}>
        <View style={tw.style('w-22', 'h-22', 'bg-gray-200', 'rounded-2xl')}></View>
        <View style={tw.style('w-16', 'h-1', 'rounded-b-lg', 'bg-gray-100')}></View>
      </View>
      <Text
        style={tw.style('mt-2', 'text-base', 'text-gray-800')}
        numberOfLines={1}
      >{name}</Text>
      <Text
        style={tw.style('text-sm', 'text-gray-400')}
        numberOfLines={1}
      >{like}k+ fov</Text>
    </View>
  )
}

const HomeBody = () => {
  const [tabBarHeight] = useAppStore(
    (s) => [s.tabBarHeight],
    shallow
  )

  return (
    <ScrollView
      contentContainerStyle={[
        !!tabBarHeight && { paddingBottom: tabBarHeight }
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw.style('px-5', 'py-3')}
      >
        {new Array(5).fill('').map((_, i) => (
          <Card
            key={`card_${i}`}
            title="Wake Your Mind Up"
            describe="Mind Fresh Song"
            style={i !== 0 && tw.style('ml-3')}
          />
        ))}
      </ScrollView>
      <View style={tw.style('flex', 'flex-row', 'justify-between', 'px-5', 'py-3')}>
        {labels.map(label => (
          <LableItem
            key={label.key}
            name={label.name}
          />
        ))}
      </View>
      <Recommend />
      <View style={tw.style('py-3')}>
        <View style={tw.style('px-5', 'flex', 'flex-row', 'justify-between')}>
          <Text style={tw.style('text-lg')}>你可能喜欢的歌单</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw.style('px-5', 'pt-3')}
        >
          {songList.map((item, i) => (
            <SongListItem
              key={`song-list-item_${i}`}
              name={item.name}
              like={item.like}
              style={i !== 0 && tw.style('ml-3')}
            />
          ))}
        </ScrollView>
      </View>
      <FootLoading complete={true} />
    </ScrollView>
  )
}

export default HomeBody
