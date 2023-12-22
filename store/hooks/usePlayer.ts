import TrackPlayer, { RepeatMode } from 'react-native-track-player'
import type { Track } from 'react-native-track-player'

import { createWithEqualityFn } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

import { zutandMmkvStorage, fyShuffle } from '@/utils'
import type { CostomTrack } from '@/hooks'

export enum PlayerRepeatMode {
  Single = 0, // 单曲循环
  Sequential = 1, // 顺序循环
  Random = 2 // 随机循环
}

interface PlayerState {
  currentPlayIndex: number
  repeatMode: PlayerRepeatMode
  songList: CostomTrack[]
  setCurrentPlayIndex: (i: PlayerState['currentPlayIndex']) => void
  setRepeatMode: (mode: PlayerRepeatMode) => void
  /**
   * 设置播放器队列
   * @param songData 带url的歌曲数据
   * @param replaceQueue 是否替换掉队列
   * @param playNow 操作结束后是否立即播放歌曲，替换操作播放第一条(替换操作即使设置成false也会立即播放)
   * @returns void
   */
  setPlayerList: (songData: CostomTrack[], replaceQueue?: boolean, playNow?: boolean) => void
  initRntpQuene: (quene: CostomTrack[]) => void // 从songList中初始化rntp列表，需要在页面第一次加载后并在setupPlayer后调用
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
    album: data.al?.name,
    artwork: data.al?.picUrl
  }
}

export const usePlayer = createWithEqualityFn<PlayerState>()(
  persist(
    (set, get) => ({
      currentPlayIndex: 0,
      repeatMode: PlayerRepeatMode.Sequential,
      songList: [],
      setCurrentPlayIndex: (i) => { set({ currentPlayIndex: i }) },
      setRepeatMode: async (mode) => {
        set({ repeatMode: mode })

        let tpRepeatMode = RepeatMode.Queue
        if (mode === PlayerRepeatMode.Single) tpRepeatMode = RepeatMode.Track

        // 随机播放算法
        if (mode === PlayerRepeatMode.Random) {
          const {
            songList,
            currentPlayIndex
          } = get()
          const currentPlaySong = songList[currentPlayIndex]
          const copySongList = [...songList]
          copySongList.splice(currentPlayIndex, 1)

          const shuffleList = fyShuffle<CostomTrack>(copySongList)
          const newList = [currentPlaySong, ...shuffleList]
          const tpQuene = shuffleList.map(item => createRntpTrack(item))

          await TrackPlayer.removeUpcomingTracks()
          await TrackPlayer.move(currentPlayIndex, 0)
          await TrackPlayer.add(tpQuene)

          set({
            currentPlayIndex: 0,
            songList: newList
          })
        }

        TrackPlayer.setRepeatMode(tpRepeatMode)
      },
      setPlayerList: async (songData, replaceQueue = false, playNow = true) => {
        try {
          const { songList, currentPlayIndex } = get()
          let playIndex = currentPlayIndex // 需要播放的索引
          let list: CostomTrack[] = []

          if (!replaceQueue) {
            // 获取rntp中的队列
            const rntpQueue = await TrackPlayer.getQueue()
            const addQueueList: Track[] = []
            list = merge2uniqueSongData(songList, songData)
            let index = list.length - 1

            for (let i = 0; i < songData.length; i++) {
              const item = songData[i]
              const findIndex = rntpQueue.findIndex(qItem => qItem.id === String(item.id))
              if (findIndex === -1) {
                addQueueList.push(createRntpTrack(item))
              } else {
                index = findIndex
              }
            }

            if (addQueueList.length > 0) await TrackPlayer.add(addQueueList)
            if (index < 0) index = 0
            if (playNow) playIndex = index
          } else {
            const tracks = songData.map(item => createRntpTrack(item))

            playIndex = 0
            list = songList

            await TrackPlayer.setQueue(tracks)
          }

          if (playNow || replaceQueue) {
            await TrackPlayer.skip(playIndex, 0)
            TrackPlayer.play()
          }
          set({
            currentPlayIndex: playIndex,
            songList: list
          })
        } catch (error) {}
      },
      initRntpQuene: async (quene) => {
        const {
          currentPlayIndex,
          repeatMode,
          setRepeatMode
        } = get()

        let playIndex = currentPlayIndex
        if (quene[playIndex] === undefined) playIndex = 0

        if (quene.length === 0) {
          playIndex = 0
        } else {
          const tracks = quene.map(item => createRntpTrack(item))
          await TrackPlayer.setQueue(tracks)
          // TrackPlayer.setRepeatMode(RepeatMode.Queue)
          // setRepeatMode(repeatMode)
          TrackPlayer.skip(playIndex, 0)
        }

        set({
          currentPlayIndex: playIndex,
          songList: quene
        })
      }
    }),
    {
      name: 'mmkv-zustand-storage-player',
      storage: createJSONStorage(() => zutandMmkvStorage)
    }
  ),
  Object.is
)
