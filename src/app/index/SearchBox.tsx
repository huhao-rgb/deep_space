import type { FC } from 'react'
import {
  useEffect,
  useState
} from 'react'

import { router } from 'expo-router'

import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Shadow } from 'react-native-shadow-2'

import { tw } from '@/utils'
import { useWyCloudApi } from '@/hooks'

import type { SearchDefaultKeyRes } from '@/api/types'

const SearchBox: FC = () => {
  const defaultKeyApi = useWyCloudApi<SearchDefaultKeyRes>('searchDefaultKey')

  const [defaultKey, setDefaultKey] = useState('输入您想要查找的关键词...')

  useEffect(
    () => {
      defaultKeyApi()
        .then(response => {
          const { status, body } = response
          if (status === 200) {
            const { code, data } = body
            code === 200 && setDefaultKey(data.showKeyword)
          }
        })
    },
    []
  )

  return (
    <View style={tw`px-5 my-6`}>
      <Shadow
        startColor="#00000009"
        distance={20}
        style={tw`w-full`}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={tw`bg-white rounded-xl`}
          // onPress={() => { router.push('/song-list/1') }}
          onPress={() => { router.push(`/search/?defaultKey=${defaultKey}`) }}
        >
          <View style={tw`px-4 py-3 flex-row items-center`}>
            <Text style={tw`text-sm text-gray-400/80`}>{defaultKey}</Text>
          </View>
        </TouchableOpacity>
      </Shadow>
    </View>
  )
}

export default SearchBox
