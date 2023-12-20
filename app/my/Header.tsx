import type { FC } from 'react'
import { useCallback } from 'react'

import {
  View,
  Text
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

import { Image } from 'expo-image'
import { router } from 'expo-router'

import Icon from '@/components/svg-icon'

import { tw } from '@/utils'

const rowKeys = [
  { key: 'gz', value: 12, title: '关注', prefix: undefined, suffix: undefined },
  { key: 'fs', value: 0, title: '粉丝', prefix: undefined, suffix: undefined },
  { key: 'dj', value: 9, title: '等级', prefix: 'Lv.', suffix: undefined },
  { key: 'cl', value: 8, title: '村龄', prefix: undefined, suffix: '年' }
]

const prefixSuffixStyle = [
  tw`text-xs text-slate-900`,
  { transform: [{ translateY: -4.5 }] }
]

const briefStyle = tw`text-xs text-slate-800`

const Header: FC = () => {
  const onLocalSong = useCallback(
    () => {
      router.push('/local-song/')
    },
    []
  )

  return (
    <View style={tw`bg-white`}>
      <Image
        source={require('@/assets/test-head.jpg')}
        style={tw`w-full h-56 rounded-b-2xl`}
      />
      <View style={tw`px-5 pb-6 flex-col justify-center items-center`}>
        <Image
          source={require('@/assets/test-head.jpg')}
          style={[
            tw`w-24 h-24 rounded-full border border-white`,
            {
              transform: [{
                translateY: -(tw`h-24`.height as number / 2)
              }]
            }
          ]}
        />
        <View style={tw`-mt-10 flex-row justify-center items-center`}>
          <Text style={tw`text-2xl text-slate-800 mr-2 font-bold`}>巡回寄生虫</Text>
          <RectButton style={tw`bg-red-100 rounded-full px-4 py-1`}>
            <Text style={tw`text-red-500 text-xs`}>编辑资料</Text>
          </RectButton>
        </View>
        <Text style={tw`mt-1 text-xs text-slate-400 text-center`}>这里是用户的签名，用户的签名</Text>

        <View style={tw`flex-row justify-center items-center mt-2`}>
          <Text style={briefStyle}>IP:未知 ·</Text>
          <Icon
            name="Man"
            width={10}
            height={10}
            fill={tw.color('blue-500')}
            style={tw`mx-1.5`}
          />
          <Text style={briefStyle}>90后 天蝎座 · 上海市</Text>
        </View>

        <View style={tw`flex-row items-center mt-6`}>
          {rowKeys.map((item) => (
            <View
              key={item.key}
              style={[
                { width: `${100 / rowKeys.length}%` },
                tw`flex-col items-center`
              ]}
            >
              <Text style={tw`text-sm text-slate-400`}>{item.title}</Text>
              <View style={tw`flex-row items-end mt-1`}>
                {item.prefix !== undefined && (
                  <Text style={prefixSuffixStyle}>{item.prefix}</Text>
                )}
                <Text style={tw`text-2xl text-slate-800`}>{item.value}</Text>
                {item.suffix !== undefined && (
                  <Text style={[...prefixSuffixStyle, tw`ml-0.5`]}>{item.suffix}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <View>
          <RectButton onPress={onLocalSong}>
            <Text style={tw`text-lg text-gray-500`}>本地音乐</Text>
          </RectButton>
        </View>
      </View>
    </View>
  )
}

export default Header
