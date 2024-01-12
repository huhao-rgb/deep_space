import { useCallback } from 'react'

import { useShallow } from 'zustand/react/shallow'

import { useWyCloudApi, useTrack } from '@/hooks'
import { usePlayer } from '@/store'

import type {
  PlaylistDetailRes,
  PlaylistTrackAllRes,
  TrackId
} from '@/api/types'

interface PromiseResult {
  code: number
  msg: string
}

type UsePlayAllSongPromise = (id?: string) => Promise<PromiseResult>

export const usePlayAllSong = (): UsePlayAllSongPromise => {
  const detailApi = useWyCloudApi<PlaylistDetailRes>('playlistDetail')
  const songDefaultApi = useWyCloudApi<PlaylistTrackAllRes>('playlistTrackAll')

  const [setPlayerList] = usePlayer(useShallow((s) => [s.setPlayerList]))

  const track = useTrack()

  const neterror = { code: -3, msg: '网络请求发生了错误' }

  const playAllSong = useCallback(
    (id?: string) => {
      return new Promise<PromiseResult>(async (resolve, reject) => {
        if (id) {
          try {
            const detailRes = await detailApi({
              data: { id },
              recordUniqueId: id as string
            })
            const { status, body } = detailRes

            if (status === 200 && body.code === 200) {
              const { trackIds } = body.playlist

              const { status: songStatus, body: songBody } = await songDefaultApi({
                data: { ids: trackIds.map((item: TrackId) => item.id) },
                recordUniqueId: id as string
              })
    
              if (songStatus === 200 && songBody.code === 200) {
                const songTracks = await track(songBody.songs)
                setPlayerList(songTracks, true)
                resolve({ code: 0, msg: 'success' })
              } else {
                reject(neterror)
              }
            } else {
              reject(neterror)
            }
          } catch (error) {
            reject({
              code: -2,
              msg: '处理歌曲数据失败',
              error
            })
          }
        } else {
          reject({ code: -1, msg: '未获取到歌单id' })
        }
      })
    },
    []
  )

  return playAllSong
}

