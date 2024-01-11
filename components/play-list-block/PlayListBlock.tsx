import type { FC } from 'react'
import { useCallback } from 'react'

import { View, Text } from 'react-native'

import { TouchableOpacity } from 'react-native-gesture-handler'
import { router } from 'expo-router'

import type { PlayListBlockProps } from './types'
import Cover from './Cover'

import { activeOpacity } from '@/constants'
import { tw } from '@/utils'

const PlayListBlock: FC<PlayListBlockProps> = (props) => {
  const {
    name,
    imageUrl,
    id,
    showPlayIcon,
    showHardShadow,
    style,
    play,
    renderExtra
  } = props

  const openSongListDetailPage = useCallback(
    () => {
      if (id) {
        router.push(`/song-list-detail/${id}`)
      }
    },
    [id]
  )

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={openSongListDetailPage}
    >
      <View style={style}>
        <View style={tw`w-28 flex-col items-center relative`}>
          <Cover
            cover={imageUrl}
            showPlayIcon={showPlayIcon}
            onPlay={play}
          />
          {showHardShadow && <View style={tw`w-22 h-2 rounded-b-lg bg-red-100`} />}
        </View>
        <Text
          style={tw`mt-1 w-28 text-xs text-gray-800 text-center`}
          numberOfLines={2}
        >
          {name}
        </Text>
        {renderExtra?.()}
      </View>
    </TouchableOpacity>
  )
}

export default PlayListBlock
