import type { FC } from 'react'
import { useMemo } from 'react'

import { View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

import { Image } from 'expo-image'

import Icon from '@/components/svg-icon'

import { tw } from '@/utils'

interface CoverProps {
  cover?: string
  showPlayIcon?: boolean
  onPlay?: () => void
}

const Cover: FC<CoverProps> = (props) => {
  const {
    cover,
    showPlayIcon,
    onPlay
  } = props

  const coverUrl = useMemo(
    () => {
      if (cover) return `${cover}?param=300y300`
      return ''
    },
    [cover]
  )

  return (
    <View style={tw`relative`}>
      <Image
        source={{ uri: coverUrl }}
        style={tw`w-28 h-28 rounded-xl bg-gray-100`}
      />
      {showPlayIcon && (
        <RectButton
          rippleColor={tw.color('red-100')}
          activeOpacity={0.8}
          style={tw`absolute right-2 bottom-2 w-6 h-6 bg-white justify-center items-center rounded-full`}
          onPress={onPlay}
        >
          <Icon
            name="SolidPlay"
            fill={tw.color('slate-800')}
            size={10}
            style={{ transform: [{ translateX: 1 }] }}
          />
        </RectButton>
      )}
    </View>
  )
}

export default Cover
