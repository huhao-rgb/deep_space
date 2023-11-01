/**
 * 获取到播放链接，并且将数据包装成react-native-track-player所需数据
 * 对象格式参考：https://rntp.dev/docs/api/objects/track
 */
import { useCallback } from 'react'

import type { Track as RNTrack } from 'react-native-track-player'

import { useWyCloudApi } from './useWyCloudApi'
import type {
  Track,
  SongUrlV1Level,
  SongUrlV1Res
} from '@/api/types'

export interface CostomTrack extends RNTrack, Omit<Track, 'id'> {
}

export const useTrack = () => {
  const songUrlApi = useWyCloudApi<SongUrlV1Res>('songUrlV1', 1000 * 60 * 60 * 2)

  const trackFn = useCallback(
    (tracks: Track[], level?: SongUrlV1Level) => {
      return new Promise<CostomTrack[]>(async (resolve, reject) => {
        try {
          const ids = tracks.map(item => item.id).join(',')

          const songUrlsRes = await songUrlApi({
            data: {
              ids,
              level
            },
            recordUniqueId: ids
          })

          const { status, body } = songUrlsRes
          if (status === 200 && body.code === 200) {
            const { data } = body
            const rnTracks = tracks.map<CostomTrack>((item, i) => {
              const { url, type } = data[i]
              const { id, ...rest } = item
              return {
                id: String(id),
                url,
                contentType: type,
                title: item.name,
                artist: item.ar?.[0].name,
                album: item.al.name,
                ...rest
              }
            })
            resolve(rnTracks)
          }
        } catch (err) {
          reject(err)
        }
      })
    },
    []
  )

  return trackFn
}
