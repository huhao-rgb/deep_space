import type { FC } from 'react'

import { View, Text } from 'react-native'

import type { RenderInfoProps } from './types'
import { tw } from '@/utils'

const RenderInfo: FC<RenderInfoProps> = ({
  title,
  subtitle,
  titleStyle,
  subtitleStyle
}) => {
  return (
    <View style={tw`flex-1`}>
      {title && (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[tw`text-base text-slate-800`, titleStyle]}
        >
          {title}
        </Text>
      )}
      {subtitle && (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[tw`flex-1 text-xs text-slate-500`, subtitleStyle]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  )
}

export default RenderInfo
