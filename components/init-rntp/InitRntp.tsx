import type { FC } from 'react'
import { memo, useEffect } from 'react'

import { shallow } from 'zustand/shallow'

import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  Capability
} from 'react-native-track-player'

import { usePlayer, usePlayerState } from '@/store'
import { useTrack } from '@/hooks'

TrackPlayer.registerPlaybackService(() => require('../../service'))

const events = [
  Event.PlaybackState,
  Event.PlaybackActiveTrackChanged,
  Event.RemotePlay,
  Event.RemotePause,
  Event.RemoteNext,
  Event.RemotePrevious
]

const InitRntp: FC = () => {
  const track = useTrack()

  const [
    songList,
    initRntpQuene,
    currentPlayIndex,
    setCurrentPlayIndex
  ] = usePlayer(
    (s) => [
      s.songList,
      s.initRntpQuene,
      s.currentPlayIndex,
      s.setCurrentPlayIndex
    ],
    shallow
  )
  const [setPlayerState] = usePlayerState(
    (s) => [s.setPlayerState],
    shallow
  )

  useEffect(
    () => {
      ;(async () => {
        try {
          await TrackPlayer.setupPlayer()

          TrackPlayer.updateOptions({
            capabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SkipToNext,
              Capability.SkipToPrevious
            ],
            compactCapabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SkipToNext,
              Capability.SkipToPrevious
            ],
            playIcon: require('@/assets/rntp/play.png'),
            pauseIcon: require('@/assets/rntp/pause.png'),
            stopIcon: require('@/assets/rntp/stop.png'),
            previousIcon: require('@/assets/rntp/previous.png'),
            nextIcon: require('@/assets/rntp/next.png')
          })

          if (songList.length > 0) {
            const tracks = await track(songList)
            initRntpQuene(tracks)
          }
        } catch (error) {}
      })()
    },
    []
  )

  useTrackPlayerEvents(events, (event) => {
    switch (event.type) {
      case Event.PlaybackState:
        setPlayerState(event.state)

        if (event.state === State.Error) {
          console.log('音频播放错误')
        }

        break
      case Event.PlaybackActiveTrackChanged:
        const { index = 0, lastIndex = 0 } = event
        if (index !== lastIndex && currentPlayIndex !== index) {
          setCurrentPlayIndex(index)
        }
      case Event.RemotePlay:
        setPlayerState(State.Paused)
        break
      case Event.RemotePause:
        setPlayerState(State.Playing)
        break
      case Event.RemoteNext:
        setCurrentPlayIndex(currentPlayIndex + 1)
        break
      case Event.RemotePrevious:
        setCurrentPlayIndex(currentPlayIndex === 0 ? 0 : currentPlayIndex - 1)
        break
      default:
        break
    }
  })

  return null
}

export default memo(InitRntp)
