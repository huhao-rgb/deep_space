import type { FC } from 'react'

import { View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

import { Image } from 'expo-image'

import Icon from '@/components/svg-icon'

import { tw } from '@/utils'

interface SongListCoverProps {
  cover: string
  onPlay?: () => void
}

const SongListCover: FC<SongListCoverProps> = (props) => {
  const { cover, onPlay } = props

  return (
    <View>
      <Image
        source={{ uri: `${cover}?param=300y300` }}
        style={tw`w-28 h-28 rounded-xl bg-gray-100`}
      />
      <RectButton
        rippleColor={tw.color('red-100')}
        activeOpacity={0.8}
        style={tw`absolute right-2 bottom-2 w-7 h-7 bg-white justify-center items-center rounded-full`}
        onPress={onPlay}
      >
        <Icon
          name="SolidPlay"
          fill={tw.color('slate-800')}
          width={12}
          height={12}
          style={{ transform: [{ translateX: 1 }] }}
        />
      </RectButton>
    </View>
  )
}

export default SongListCover
