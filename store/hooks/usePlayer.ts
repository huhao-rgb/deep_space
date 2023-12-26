import TrackPlayer, { RepeatMode } from 'react-native-track-player'
import type { Track } from 'react-native-track-player'

import { createWithEqualityFn } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

import {
  zutandMmkvStorage,
  fyShuffle,
  rangeRandomNumber
} from '@/utils'
import type { CostomTrack } from '@/hooks'

const tag = 'usePlayer'

export enum PlayerRepeatMode {
  Single = 0, // 单曲循环
  Sequential = 1, // 顺序循环
  Random = 2 // 随机循环
}

interface PlayerState {
  currentPlayIndex: number
  repeatMode: PlayerRepeatMode
  metaSongList: CostomTrack[] // 原始播放列表
  songList: CostomTrack[] // 正式播放列表
  setCurrentPlayIndex: (i: PlayerState['currentPlayIndex']) => void
  setRepeatMode: (mode: PlayerRepeatMode) => void
  /**
   * 设置播放器队列
   * @param songData 带url的歌曲数据, 如果是数组则替换操作，如果是对象则追加操作
   * @param playNow 操作结束后是否立即播放歌曲，替换操作播放第一条(替换操作即使设置成false也会立即播放)
   * @returns void
   */
  setPlayerList: (songData: CostomTrack | CostomTrack[], playNow?: boolean) => void
  initRntpQuene: (quene: CostomTrack[], playNow?: boolean) => void // 从songList中初始化rntp列表，需要在页面第一次加载后并在setupPlayer后调用
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
      metaSongList: [],
      songList: [],
      setCurrentPlayIndex: (i) => { set({ currentPlayIndex: i }) },
      setRepeatMode: async (mode) => {
        set({ repeatMode: mode })

        let tpRepeatMode = RepeatMode.Queue
        if (mode === PlayerRepeatMode.Single) tpRepeatMode = RepeatMode.Track

        // 随机播放模式
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
        } else {
          const {
            metaSongList,
            currentPlayIndex,
            songList
          } = get()
          const id = songList?.[currentPlayIndex].id
          if (id) {
            const findIndex = metaSongList.findIndex(item => item.id === id)
            if (findIndex !== -1) {
              const playList = [...metaSongList]
              playList.splice(findIndex, 1)

              await TrackPlayer.removeUpcomingTracks()
              await TrackPlayer.add(playList.map(item => createRntpTrack(item)))
              await TrackPlayer.move(0, findIndex)

              playList.splice(findIndex, 0, songList[currentPlayIndex])

              set({
                songList: playList,
                metaSongList,
                currentPlayIndex: findIndex
              })
            }
          }
        }

        TrackPlayer.setRepeatMode(tpRepeatMode)
      },
      /**
       * 列表循环模式，追加到数组最后一位
       * 随机播放模式，追加到原始数组中，再随机出一位，添加到播放数组中
       */
      setPlayerList: async (songData, playNow = true) => {
        try {
          const {
            repeatMode,
            currentPlayIndex,
            metaSongList,
            songList
          } = get()

          const replaceQueue = Array.isArray(songData)
          let playQueue: CostomTrack[] = [] // 最终播放队列
          let metaQueue = [...metaSongList] // 原始队列
          let playIndex = 0 // 即将播放索引

          if (replaceQueue) {
            playQueue = repeatMode === PlayerRepeatMode.Random
              ? fyShuffle<CostomTrack>(songData)
              : songData

            metaQueue = songData
            await TrackPlayer.setQueue(playQueue.map(item => createRntpTrack(item)))
          } else {
            const findIndex = songList.findIndex(item => item.id === songData.id)

            if (findIndex === -1) {
              const playSongList = [...songList]

              if (repeatMode === PlayerRepeatMode.Random) {
                const len = playSongList.length

                playIndex = len > 1 ? rangeRandomNumber(0, len - 1) : 0
                playSongList.splice(
                  playIndex === 0 ? 0 : playIndex,
                  0,
                  songData
                )
              } else {
                playSongList.push(songData)
                playIndex = playSongList.length - 1
              }

              playQueue = playSongList
              metaQueue.push(songData) // 原始数据，不管什么模式都是追加操作

              await TrackPlayer.add(
                createRntpTrack(songData),
                PlayerRepeatMode.Random
                  ? playIndex === 0 ? undefined : playIndex
                  : undefined
              )
            } else {
              playQueue = songList
              playIndex = findIndex
            }

            if (currentPlayIndex !== findIndex) {
              TrackPlayer.skip(playIndex)
            }
          }

          if (playNow || replaceQueue) TrackPlayer.play()

          set({
            currentPlayIndex: playIndex,
            songList: playQueue,
            metaSongList: metaQueue
          })
        } catch (error) {}
      },
      initRntpQuene: async (quene, playNow) => {
        const { currentPlayIndex, repeatMode } = get()

        let playIndex = currentPlayIndex
        if (quene[playIndex] === undefined) playIndex = 0

        if (quene.length === 0) {
          playIndex = 0
        } else {
          const tracks = quene.map(item => createRntpTrack(item))
          await TrackPlayer.setQueue(tracks)
          TrackPlayer.skip(playIndex, 0)
          await TrackPlayer.setRepeatMode(
            repeatMode === PlayerRepeatMode.Single
              ? RepeatMode.Track
              : RepeatMode.Queue
          )
          if (playNow) {
            TrackPlayer.play()
          }
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
