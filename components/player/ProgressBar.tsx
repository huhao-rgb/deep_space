import { memo } from 'react'

import { View, Text } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'

import { tw } from '@/utils'

interface ProgressBarProps {
  style?: StyleProp<ViewStyle>
}

const timeTextStyle = tw`text-2xs text-gray-400 w-12`

const ProgressBar = memo<ProgressBarProps>((props) => {
  const { style } = props

  return (
    <View style={[tw`flex-row items-center`, style]}>
      <Text style={timeTextStyle}>00:00</Text>
      <View style={tw`flex-1 h-1.5 bg-black/5 rounded-2xl`}></View>
      <Text style={[timeTextStyle, tw`text-right`]}>00:00</Text>
    </View>
  )
})

export default ProgressBar
