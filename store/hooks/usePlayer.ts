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
   * 设置播放器队列
   * @param songData 带url的歌曲数据
   * @param replaceQueue 是否替换掉队列
   * @param playNow 操作结束后是否立即播放歌曲，替换操作播放第一条(替换操作即使设置成false也会立即播放)
   * @returns void
   */
  setPlayerList: (songData: CostomTrack[], replaceQueue?: boolean, playNow?: boolean) => void
}

// 合并去重歌曲数据
const merge2uniqueSongData = (arr1: CostomTrack[], arr2: CostomTrack[]) => {
  const mergeArray = [...arr1, ...arr2]
  const map = new Map()
  return mergeArray.filter(item => {
      return !map.has(item.id) && map.set(item.id, 1)
  })
}

const createRntpTrack = (data: CostomTrack): Track => {
  return {
    id: String(data.id),
    url: data.url,
    contentType: data.type,
    title: data.name,
    artist: data.ar?.[0].name,
    album: data.al?.name
  }
}

export const usePlayer = createWithEqualityFn<PlayerState>()(
  persist(
    (set, get) => ({
      currentPlayIndex: 0,
      miniPlayerRef: createRef(),
      miniPlayerHeight: 0,
      isShowMiniPlayer: false,
      songList: [],
      setCurrentPlayIndex: (i) => { set({ currentPlayIndex: i }) },
      setShowMiniPlayer: () => {
        const { songList, miniPlayerRef } = get()
        const show = songList.length > 0
        set({ isShowMiniPlayer: show })
        miniPlayerRef.current?.setShowPlayer(show)
      },
      setMniPlayerHeight: (h) => { set({ miniPlayerHeight: h }) },
      setPlayerList: async (songData, replaceQueue = false, playNow = true) => {
        try {
          const { songList, currentPlayIndex } = get()
          let playIndex = currentPlayIndex // 需要播放的索引
          let list: CostomTrack[] = []

          if (!replaceQueue) {
            // 获取rntp中的队列
            const rntpQueue = await TrackPlayer.getQueue()
            const addQueueList: Track[] = []

            for (let i = 0; i < songData.length; i++) {
              const item = songData[i]
              const findIndex = rntpQueue.findIndex(qItem => qItem.id === String(item.id))
              if (findIndex === -1) addQueueList.push(createRntpTrack(item))
            }

            playNow && (playIndex += addQueueList.length) // 设置需要播放的索引
            list = merge2uniqueSongData(songList, songData)

            TrackPlayer.add(addQueueList)
          } else {
            const tracks = songData.map(item => createRntpTrack(item))

            playIndex = 0
            list = songList

            TrackPlayer.setQueue(tracks)
          }

          if (playNow || replaceQueue) TrackPlayer.skip(playIndex, 0)
          set({
            currentPlayIndex: playIndex,
            songList: list
          })
        } catch (error) {}
      }
    }),
    {
      name: 'mmkv-zustand-storage-player',
      storage: createJSONStorage(() => zutandMmkvStorage)
    }
  )
)
