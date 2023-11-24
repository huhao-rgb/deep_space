import type { FC } from 'react'

import { View, Text } from 'react-native'

import type { NativeStackHeaderProps } from '@react-navigation/native-stack'

import SafeAreaView from '../safe-area-view'
import { tw } from '@/utils'

const CommonHeader: FC<NativeStackHeaderProps> = () => {
  return (
    <SafeAreaView
      edges={['top']}
      style={tw`px-5`}
    >
      <View style={tw`py-3`}>
        <Text>这是头部</Text>
      </View>
    </SafeAreaView>
  )
}

export default CommonHeader
