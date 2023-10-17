import type { FC } from 'react'

import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { tw } from '@/utils'

import type { CardProps } from './types'

const Card: FC<CardProps> = (props) => {
  const {
    text,
    showMoreText = true,
    moreText = '查看更多',
    style,
    headStyle,
    containerStyle,
    renderHeadLeftTextEle,
    children,
    onPress
  } = props

  return (
    <View style={style}>
      <View
        style={[
          tw`px-5 flex-row items-center justify-between`,
          headStyle
        ]}
      >
        <View style={tw`flex-1 flex-row items-center mr-4`}>
          <Text style={[tw`text-lg text-zinc-800 font-bold`]}>{text}</Text>
          {renderHeadLeftTextEle !== null && (
            <View style={tw`ml-3`}>{renderHeadLeftTextEle?.()}</View>
          )}
        </View>
        {showMoreText && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={tw`py-1`}
            onPress={onPress}
          >
            <Text style={tw`text-zinc-400/80 text-sm`}>{moreText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={[
          tw`mt-4`,
          containerStyle
        ]}
      >
        {children}
      </View>
    </View>
  )
}

export default Card
