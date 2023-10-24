import { Link } from 'expo-router'
import { Text, View } from 'react-native'

import { tw } from '../utils'

export default function NotFoundScreen() {
  return (
    <View style={tw`flex-1 bg-white justify-center items-center`}>
      <Text style={tw`text-xl font-bold`}>This screen doesn't exist.</Text>

      <Link href="/index/" style={tw`mt-4`}>
        <Text style={tw`text-base text-blue-500`}>Go to home screen!</Text>
      </Link>
    </View>
  )
}
