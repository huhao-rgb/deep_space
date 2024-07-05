import type { FC } from 'react'
import { memo, useEffect } from 'react'

import { useShallow } from 'zustand/react/shallow'

import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  Capability
} from 'react-native-track-player'

import {
  usePlayer,
  usePlayerState,
  PlayerRepeatMode
} from '@/store'
import { useTrack } from '@/hooks'

TrackPlayer.registerPlaybackService(() => require('../../../service'))

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
    repeatMode,
    songList,
    initRntpQuene,
    currentPlayIndex,
    setCurrentPlayIndex
  ] = usePlayer(
    useShallow((s) => [
      s.repeatMode,
      s.songList,
      s.initRntpQuene,
      s.currentPlayIndex,
      s.setCurrentPlayIndex
    ])
  )
  const [setPlayerState] = usePlayerState(useShallow((s) => [s.setPlayerState]))

  useEffect(
    () => {
      ;(async () => {
        try {
          await TrackPlayer.setupPlayer({
            autoHandleInterruptions: true
          })

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
    const totalIndex = songList.length - 1

    switch (event.type) {
      case Event.PlaybackState:
        setPlayerState(event.state)

        if (event.state === State.Error) {
          // 大部分的错误是网易云音频链接过期，重新刷新的链接
          track(songList)
            .then(tracks => {
              initRntpQuene(tracks, true)
            })
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
        if (repeatMode !== PlayerRepeatMode.Single) {
          setCurrentPlayIndex(currentPlayIndex === totalIndex ? 0 : currentPlayIndex + 1)
        }
        break
      case Event.RemotePrevious:
        if (repeatMode !== PlayerRepeatMode.Single) {
          setCurrentPlayIndex(currentPlayIndex === 0 ? totalIndex : currentPlayIndex - 1)
        }
        break
      default:
        break
    }
  })

  return null
}

export default memo(InitRntp)
