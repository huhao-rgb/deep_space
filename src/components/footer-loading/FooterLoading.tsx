import type { FC } from 'react'

import {
  View,
  Text,
  ActivityIndicator
} from 'react-native'
import Lottie from 'lottie-react-native'

import { tw } from '@/utils'
import type { FooterLoadingProps } from './types'

const FooterLoading: FC<FooterLoadingProps> = (props) => {
  const {
    loading,
    noText = '到底了，没有更多内容了',
    loadingText = '加载中...'
  } = props

  return (
    <View style={tw`flex-row items-center justify-center`}>
      {loading
        ? (
            <ActivityIndicator
              size="small"
              color={tw.color('red-500')}
            />
          )
        : (
            <Lottie
              autoPlay
              loop
              source={require('@/assets/lottie/moon.json')}
              style={[tw`w-16 h-16`]}
            />
          )}
      <Text style={tw`text-sm text-gray-400`}>
        {loading ? loadingText : noText}
      </Text>
    </View>
  )
}

export default FooterLoading
