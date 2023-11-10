/**
 * 获取到播放链接，并且将数据包装成react-native-track-player所需数据
 * 对象格式参考：https://rntp.dev/docs/api/objects/track
 */
import { useCallback } from 'react'

import { useWyCloudApi } from './useWyCloudApi'
import type {
  Track,
  SongUrlV1Level,
  SongUrlV1Res,
  SongUrl
} from '@/api/types'

export type CostomTrack = Track & SongUrl 

export const useTrack = () => {
  const songUrlApi = useWyCloudApi<SongUrlV1Res>('songUrlV1', 1000 * 60 * 2)

  const trackFn = useCallback(
    (tracks: Track[], level?: SongUrlV1Level) => {
      return new Promise<CostomTrack[]>(async (resolve, reject) => {
        try {
          const ids = tracks.map(item => Number(item.id)).join(',')

          const songUrlsRes = await songUrlApi({
            data: { ids, level },
            recordUniqueId: ids
          })

          const { status, body } = songUrlsRes
          if (status === 200 && body.code === 200) {
            const { data } = body
            const songTracks = tracks.map<CostomTrack>((item, i) => ({
              ...item,
              ...data[i]
            }))
            resolve(songTracks)
          }
        } catch (err) { reject(err) }
      })
    },
    []
  )

  return trackFn
}
