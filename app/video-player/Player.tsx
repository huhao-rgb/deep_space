import type { FC } from 'react'
import { useRef, useCallback } from 'react'

import { View, useWindowDimensions } from 'react-native'
import { Video } from 'expo-av'
import type { AVPlaybackStatus } from 'expo-av'

import { tw } from '@/utils'

interface PlayerProps {
  width?: number
  videoUrl?: string
}

const Player: FC<PlayerProps> = (props) => {
  const {
    width
  } = props

  const videoRef = useRef<Video>(null)

  const { width: screenWidth } = useWindowDimensions()

  const defaultVideoWidth = width || screenWidth
  const videoHeight = defaultVideoWidth * 9 / 16.0

  const updatePlaybackStatus = useCallback(
    (status: AVPlaybackStatus) => {},
    []
  )

  return (
    <View
      style={[
        tw`bg-black`,
        {
          width: defaultVideoWidth,
          height: videoHeight
        }
      ]}
    >
      <Video
        ref={videoRef}
        useNativeControls={false}
        style={tw`flex-1 justify-center`}
        onPlaybackStatusUpdate={updatePlaybackStatus}
      />
    </View>
  )
}

export default Player
