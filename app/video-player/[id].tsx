import type { FC } from 'react'
import {
  useEffect,
  useState,
  useCallback
} from 'react'

import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import type { ListRenderItem } from '@shopify/flash-list'

import { Image } from 'expo-image'

import SafeAreaView from '@/components/safe-area-view'
import { PagingListFlashList } from '@/components/paging-list'

import Player from './Player'

import { tw } from '@/utils'
import { useWyCloudApi } from '@/hooks'
import { MvDetailRes } from '@/api/types'

interface MvState {
  name: string
  cover: string
  artistName: string
  playCount: number
  publishTime: string
  playUrl: string
}

const VideoPlayer: FC = () => {
  const { id } = useLocalSearchParams()

  const [mvState, setMvState] = useState<MvState>({
    name: '',
    cover: '',
    artistName: '',
    playCount: 0,
    publishTime: '',
    playUrl: ''
  })

  const mvDetailApi = useWyCloudApi<MvDetailRes>('mvDetail')
  const mvUrlApi = useWyCloudApi('mvUrl', 1000 * 60 * 2)

  const extraData = Object.assign({}, mvState)

  useEffect(
    () => {
      (async () => {
        try {
          const mvDetailRes = await mvDetailApi({
            data: { id },
            recordUniqueId: id as string
          })
          const { status, body } = mvDetailRes
          if (status === 200 && body.code === 200) {
            const {
              name,
              cover,
              artistName,
              playCount,
              publishTime
            } = body.data

            let url = ''

            const urlRes = await mvUrlApi({
              data: { id },
              recordUniqueId: id as string
            })

            if (urlRes.status === 200 && urlRes.body.code === 200) {}

            setMvState({
              name,
              cover,
              artistName,
              playCount,
              publishTime,
              playUrl: url
            })
          }
        } catch (e) {}
      })()
    },
    []
  )

  const renderItem = useCallback<ListRenderItem<any>>(
    () => {
      return <></>
    },
    []
  )

  const renderHeader = useCallback(
    (p: any) => {
      console.log('header props:', p)
      return (
        <View>
          <View style={tw`flex-row items-center`}>
            <View style={tw`flex-row items-center`}>
              <Image
                style={tw`w-10 h-10 rounded-full`}
              />
              <Text></Text>
            </View>
          </View>
        </View>
      )
    },
    []
  )

  return (
    <>
      <SafeAreaView
        edges={['top']}
        style={tw`bg-black`}
      >
        <Player />
        <PagingListFlashList
          estimatedItemSize={200}
          extraData={extraData}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
        />
      </SafeAreaView>
    </>
  )
}

export default VideoPlayer
