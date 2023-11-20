import type { FC } from 'react'
import { useState, useEffect } from 'react'

import { View, Text } from 'react-native'

import { Image } from 'expo-image'

import { tw } from '@/utils'

const Header: FC = () => {
  return (
    <View>
      <Image
        source={{ uri: 'https://imgapi.cn/api.php?fl=suiji&zd=mobile&gs=images' }}
        style={tw`w-full h-52`}
      />
      <View style={tw`absolute -bottom-10 left-5 right-5`}>
        <View style={tw`bg-white rounded-xl`}>
          <View style={tw`w-full absolute -top-10 flex-row justify-center items-center`}>
            <Image
              style={tw`w-20 h-20 rounded-full`}
            />
          </View>
          <Text>xun兆找333</Text>
          <Text>测试111测试111111</Text>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-1/3`}>
              <Text>25</Text>
              <Text>关注</Text>
            </View>
            <View style={tw`w-1/3`}>
              <Text>0</Text>
              <Text>粉丝</Text>
            </View>
            <View style={tw`w-1/3`}>
              <Text>lv.9</Text>
              <Text>等级</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Header
