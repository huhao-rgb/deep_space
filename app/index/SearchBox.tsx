import type { FC } from 'react'

import { router } from 'expo-router'

import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Shadow } from 'react-native-shadow-2'

import { tw } from '@/utils'

const SearchBox: FC = () => {
  return (
    <View style={tw`px-5 my-6`}>
      <Shadow
        startColor="#f6f6f6bb"
        distance={20}
        style={tw`w-full`}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={tw`bg-white rounded-xl`}
          onPress={() => { router.push('/song-list/1') }}
        >
          <View style={tw`px-4 py-3 flex-row items-center`}>
            <Text style={tw`text-sm text-gray-400/80`}>输入您想要查找的关键词...</Text>
          </View>
        </TouchableOpacity>
      </Shadow>
    </View>
  )
}

export default SearchBox
