import type { FC } from 'react'
import { useMemo } from 'react'

import { View, Text } from 'react-native'
import { Image } from 'expo-image'

import { TouchableOpacity } from 'react-native-gesture-handler'
import { ChevronRightIcon } from 'react-native-heroicons/solid'
import { HandThumbUpIcon } from 'react-native-heroicons/outline'

import { tw, getSvgProps } from '@/utils'
import { activeOpacity } from '@/constants'

interface Props {
  imgUrl: string
  name: string
  time: string
  likeNum: number
  content: string
  replyCount: number
  onPressReply?: () => void
}

const CommentItem: FC<Props> = (props) => {
  const {
    imgUrl,
    name,
    time,
    likeNum,
    content,
    replyCount,
    onPressReply
  } = props

  const imageUrl = useMemo(
    () => {
      if (imgUrl) {
        return `${imgUrl}?param100y100`
      }
      return ''
    },
    [imgUrl]
  )

  return (
    <View style={tw`py-2 px-5 flex-row`}>
      <Image
        source={{ uri: imageUrl }}
        style={tw`mt-0.5 w-8 h-8 rounded-full`}
      />
      <View style={tw`flex-1 ml-3`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`mr-3`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-sm text-slate-600`}>{name}</Text>
            </View>
            <Text style={tw`mt-1 text-2xs text-slate-400`}>{time}</Text>
          </View>

          <View style={tw`flex-row items-center`}>
            <Text style={tw`mr-1 text-xs text-slate-400`}>{likeNum}</Text>

            <HandThumbUpIcon
              {...getSvgProps({
                size: 'sm',
                color: tw.color('slate-400')
              })}
            />
          </View>
        </View>

        <Text style={tw`my-2 text-base text-slate-600`}>{content}</Text>

        {replyCount > 0 && (
          <TouchableOpacity
            activeOpacity={activeOpacity}
            style={tw`flex-row items-center`}
            onPress={onPressReply}
          >
            <Text style={tw`text-xs text-blue-600`}>
              {replyCount}条回复
            </Text>
            <ChevronRightIcon
              {...getSvgProps({
                size: 'sm',
                fill: tw.color('blue-600')
              })}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default CommentItem
