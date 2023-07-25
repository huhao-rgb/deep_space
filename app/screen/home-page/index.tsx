import type { FC } from 'react'
import { useState } from 'react'

import {
  View,
  Text,
  ScrollView
} from 'react-native'

import SafeAreaView from '@/components/safe-area-view'

import SearchBox from './SearchBox'
import Card from './Card'

import type { BottomTabsScreenProps } from '@/types'
import tw from '@/tailwind'

const HomePage: FC<BottomTabsScreenProps<'HomePage'>> = () => {
  const [recommend] = useState(new Array(10).fill(''))

  return (
    <SafeAreaView
      edges={['top']}
      style={tw`flex-1 bg-white`}
    >
      <ScrollView>
        <View style={tw`px-5 mt-4`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-2xl font-bold text-zinc-800`}>深空场</Text>
          </View>
          <Text style={tw`text-sm text-zinc-400/80`}>DeepSpace-探索你喜爱的音乐</Text>
        </View>
        <SearchBox />
        <Card text="推荐歌单">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`px-5`}
          >
            {recommend.map((item, i) => (
              <View
                style={[
                  i !== 0 && tw`ml-4`,
                  tw`w-32`
                ]}
                key={`recommend_${i}`}
              >
                <View style={tw`h-32 w-32 rounded-xl bg-gray-100`} />
                <Text
                  style={tw`mt-1 text-zinc-600 text-sm`}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  狂人日记【中国摇滚的呐喊】
                </Text>
              </View>
            ))}
          </ScrollView>
        </Card>
        <Card
          text="为你推荐"
          style={tw`mt-8`}
          containerStyle={tw`px-5`}
        >
          {recommend.map((ite, i) => (
            <View
              style={[
                i !== 0 && tw`mt-2`,
                tw`flex-row items-center`
              ]}
            >
              <View style={tw`w-20 h-20 rounded-xl bg-gray-100 mr-3`} />
              <View style={tw`flex-row items-center flex-1`}>
                <View style={tw`flex-1 mr-2`}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={tw`text-zinc-600 text-base`}
                  >
                      带你去找夜生活
                    </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={tw`text-zinc-400 text-sm`}
                  >
                    告五人 - 带你去找夜生活
                  </Text>
                  <View style={tw`flex-row mt-1`}>
                    <Text style={tw`px-3 py-0.5 rounded-full text-xs bg-red-100 text-red-600`}>
                      小众推荐
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomePage
