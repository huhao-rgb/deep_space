import { Text, View } from 'react-native'

import { Link } from 'expo-router'

import { tw } from '@/utils'

export default function Home () {
  return (
    <View style={tw`flex-1`}>
      <Text>Home Screen 22</Text>
      <Link href="/my/">
        跳转到home
      </Link>
    </View>
  )
}