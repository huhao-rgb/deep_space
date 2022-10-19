import { type FC, useState } from 'react'
import {
  ScrollView,
  Text,
  View,
  useWindowDimensions
} from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'

import tw from '@/tailwind'

import shallow from 'zustand/shallow'
import { useAppStore } from '@/store'

type CardProps = {
  title: string
  describe: string
  style?: StyleProp<ViewStyle>
}

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
        contentContainerStyle={tw.style('px-5')}
      >
        {new Array(5).fill('').map((_, i) => (
          <Card
            key={`card_${i}`}
            title="Wake Your Mind Up"
            describe="Mind Fresh Song"
            style={[i !== 0 && tw.style('ml-3')]}
          />
        ))}
      </ScrollView>
    </ScrollView>
  )
}

export default HomeBody
