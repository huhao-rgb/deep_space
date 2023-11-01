import type { RefObject } from 'react'
import { createRef } from 'react'

import TrackPlayer from 'react-native-track-player'
import type { Track } from 'react-native-track-player'

import { createWithEqualityFn } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

import { zutandMmkvStorage } from '@/utils'
import type { CostomTrack } from '@/hooks'

import type { BottomPlayerRef } from '@/components/bottom-player'
interface PlayerState {
  currentPlayIndex: number
  miniPlayerRef: RefObject<BottomPlayerRef>
  miniPlayerHeight: number
  isShowMiniPlayer: boolean
  songList: CostomTrack[]
  setCurrentPlayIndex: (i: PlayerState['currentPlayIndex']) => void
  setShowMiniPlayer: () => void
  setMniPlayerHeight: (h: PlayerState['miniPlayerHeight']) => void
  /**
   * 设置播放器歌曲列表
   * songData 如果是数组，则替换整个播放列表，如果是对象，则push到播放列表
   * 替换列表通常在播放全部操作时发送
   * 如果使用push操作，则调用rntp播放器add方法，如果是替换操作，则调用rntp播放器setQueue方法
   * addPlayNow - 操作后是否立即播放最后一条音频
   */
  addPlayerList: (songData: CostomTrack | CostomTrack[], addPlayNow?: boolean) => void
}

export const usePlayer = createWithEqualityFn<PlayerState>()(
  persist(
    (set, get) => ({
      currentPlayIndex: 0,
      miniPlayerRef: createRef(),
      miniPlayerHeight: 0,
      isShowMiniPlayer: false,
      songList: [],
      setCurrentPlayIndex: (i) => {
        set({ currentPlayIndex: i })
      },
      setShowMiniPlayer: () => {
        const { songList, miniPlayerRef } = get()
        const show = songList.length > 0
        set({ isShowMiniPlayer: show })
        miniPlayerRef.current?.setShowPlayer(show)
      },
      setMniPlayerHeight: (h) => { set({ miniPlayerHeight: h }) },
      addPlayerList: (songData, addPlayNow = false) => {
        const { songList, currentPlayIndex } = get()
        const isQueue = Array.isArray(songData)

        let songs = isQueue ? songData : [songData]
        let newSongList: CostomTrack[] = []

        !isQueue
          ? newSongList = [...songList, ...songs]
          : newSongList = songs

        const rntpTracks = newSongList.map<Track>((item) => {
          const { id, url, contentType, title, artist, album } = item
          return {
            id,
            url,
            contentType,
            title,
            artist,
            album
          }
        })

        let currentIndex: number = currentPlayIndex
        if (isQueue) {
          currentIndex = 0
          TrackPlayer.setQueue(rntpTracks)
        } else {
          // 设置当前索引
          addPlayNow === true && (currentIndex = newSongList.length - 1)
          TrackPlayer.add(rntpTracks)
        }

        set({
          currentPlayIndex: currentIndex,
          songList: newSongList
        })
      }
    }),
    {
      name: 'mmkv-zustand-storage-player',
      storage: createJSONStorage(() => zutandMmkvStorage)
    }
  )
)
