import type { FC } from 'react'
import {
  useEffect,
  useState,
  useCallback
} from 'react'

import * as MediaLibrary from 'expo-media-library'
import type { AssetsOptions } from 'expo-media-library'

// 上一页返回的最后一项的资产 ID
let afterAssetsId: string

const LocalSong: FC = () => {
  const [songList] = useState([])

  const setLocalSong = useCallback(
    async (options?: AssetsOptions, cover?: boolean) => {
      try {
        const mergeOptions = {
          ...options,
          mediaType: MediaLibrary.MediaType.audio,
          afterAssetsId
        }
  
        const assets = await MediaLibrary.getAssetsAsync(mergeOptions)
        // console.log(assets)
      } catch (e) {
        console.error(`设置本地音乐列表错误：${e}`)
      }
    },
    []
  )

  useEffect(
    () => {
      MediaLibrary.getPermissionsAsync()
        .then(async response => {
          const { status } = response
          const { PermissionStatus } = MediaLibrary

          if (status === PermissionStatus.GRANTED) {
            setLocalSong()
          } else if (status === PermissionStatus.UNDETERMINED) {
            const requestPermissionResult = await MediaLibrary.requestPermissionsAsync()

            if (requestPermissionResult.status === PermissionStatus.GRANTED) {
              setLocalSong()
            }
          }
          console.log('当前权限', response)
        })
    },
    []
  )

  return (
    null
  )
}

export default LocalSong
