import type { FC } from 'react'
import { useState } from 'react'

import {
  Text,
  View,
  Image,
  ScrollView
} from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Lottie from 'lottie-react-native'

import SearchBox from './SearchBox'
import Navs from './Navs'
import Card from './Card'

import PageScrollView from '@/components/page-scrollview'

import { tw } from '@/utils'

const offset = tw.style('w-5').width as number

const RenderScreen = () => {
  return (
    <>
      {new Array(3).fill('').map((ite, i) => (
        <View
          style={[
            i !== 0 && tw`mt-2`,
            tw`flex-row items-center`
          ]}
          key={`list-page-${i}`}
        >
          <Image
            source={{ uri: 'https://picsum.photos/200' }}
            style={tw`w-20 h-20 rounded-xl bg-gray-100 mr-3`}
          />
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
    </>
  )
}

const Home: FC = () => {
  const [recommend] = useState(new Array(10).fill(''))

  const { top, bottom } = useSafeAreaInsets()

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: top,
        paddingBottom: bottom
      }}
      style={tw`bg-white`}
    >
      <View style={tw`px-5 mt-4 flex-row justify-between items-center`}>
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-2xl font-bold text-zinc-800`}>深空场</Text>
          </View>
          <Text style={tw`text-sm text-zinc-400/80`}>DeepSpace-探索你喜爱的音乐</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={tw`w-12 h-12 rounded-full bg-gray-100`}
        ></TouchableOpacity>
      </View>

      <SearchBox />
      <Navs />

      <Card text="推荐歌单">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-5`}
        >
          {recommend.map((item, i) => (
            <View
              style={[
                i !== 0 && tw`ml-2`,
                tw`w-28`
              ]}
              key={`recommend_${i}`}
            >
              <View style={tw`relative`}>
                <Image
                  source={{ uri: 'https://picsum.photos/200' }}
                  style={tw`w-28 h-28 rounded-xl bg-gray-100`}
                />
                <View style={tw`w-10 h-5`}>
                  {/* <BlurView
                    style={tw`absolute inset-0`}
                    blurType="dark"
                    blurAmount={50}
                  /> */}
                </View>
              </View>
              <Text
                style={[tw`mt-1 text-zinc-600 text-sm`]}
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
      >
        <PageScrollView
          offset={offset}
          routes={Array(3).fill('').map((_, i) => ({ key: String(i) }))}
          paddingHorizontal={offset}
          RenderScreen={RenderScreen}
        />
      </Card>

      <Card
        text="你的雷达歌单"
        style={tw`mt-8`}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-5`}
        >
          {Array(6).fill('').map((_, i) => (
            <View
              style={[
                tw`flex-col justify-center items-center`,
                i !== 0 && tw`ml-2`
              ]}
              key={`ld_i${i}`}
            >
            <View style={tw`w-28 flex-col items-center relative`}>
              <View style={tw`w-28 h-28 bg-gray-200 rounded-2xl`}></View>
              <View style={tw`w-22 h-2 rounded-b-lg bg-gray-100`}></View>
            </View>
            <Text
              style={tw`mt-1 text-sm text-gray-800`}
              numberOfLines={2}
            >
              Top 15 Rap
            </Text>
            <Text
              style={tw`text-xs text-gray-400`}
              numberOfLines={1}
            >
              7.6k+ fov
            </Text>
          </View>
          ))}
        </ScrollView>
      </Card>

      <View style={tw`flex-row items-center justify-center`}>
        <Lottie
          autoPlay
          loop
          source={require('@/assets/lottie/moon.json')}
          style={[tw`w-16 h-16`]}
        />
        <Text style={tw`text-sm text-gray-400`}>
          到底了，没有更多内容了
        </Text>
      </View>
    </ScrollView>
  )
}

export default Home