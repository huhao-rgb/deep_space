import type { FC } from 'react'
import { useCallback } from 'react'

import { View, Text } from 'react-native'
import type { ListRenderItem } from '@shopify/flash-list'
import { Image } from 'expo-image'

import TabsView from '@/components/tabs-view'
import type { Route, RenderSceneProps } from '@/components/tabs-view'
import { PagingListFlashList } from '@/components/paging-list'
import type { Paging, CustomResponse } from '@/components/paging-list'
import SongInfoItem from '@/components/song-info-item'
import ListItem from '@/components/list-item'
import type { RenderPicImgProps } from '@/components/list-item'
import Button from '@/components/button'

import { useWyCloudApi } from '@/hooks'
import { tw, formatTime } from '@/utils'

interface ResultTabs {
  value: string
}

type SceneProps = ResultTabs & {
  tabKey: string
}

interface PicImgProps extends RenderPicImgProps {
  durationMs: number
}

const imgWidth = tw`w-40`.width as number

const tabs = [
  { name: '单曲', value: 1 },
  { name: '专辑', value: 10 },
  { name: '歌手', value: 100 },
  { name: '歌单', value: 1000 },
  { name: '用户', value: 1002 },
  { name: 'MV', value: 1004 },
  // { name: '歌词', value: 1006 },
  { name: '视频', value: 1014 }
]

const resultKey = {
  1: { count: 'songCount', list: 'songs' },
  10: { count: 'albumCount', list: 'albums' },
  100: { count: 'artistCount', list: 'artists' },
  1000: { count: 'playlistCount', list: 'playlists' },
  1002: { count: 'userprofileCount', list: 'userprofiles' },
  1004: { count: 'mvCount', list: 'mvs' },
  // 1: { count: 'songCount', list: 'songs' },
  1014: { count: 'videoCount', list: 'videos' }
}

const formatLineText = (txt1?: string, txt2?: string) => {
  const showLine = [txt1, txt2].filter(t => t !== undefined).length === 2
  return `${txt1 ?? ''}${showLine ? ' - ' : ''}${txt2 ?? ''}`
}

const routes = tabs.map(item => ({
  key: String(item.value),
  title: item.name,
  testID: `tab_search_${item.value}`
}))

const PicImg: FC<PicImgProps> = (props) => {
  const { picUrl, durationMs } = props

  const height = imgWidth * 9 / 16.0

  return picUrl && (
    <View style={tw`relative mr-3`}>
      <Image
        source={{ uri: `${picUrl}?param=${imgWidth}y${height}` }}
        style={[
          {
            width: imgWidth,
            height
          },
          tw`rounded-lg`
        ]}
      />
      {durationMs !== undefined && (
        <Text style={tw`absolute bottom-2 right-3 z-10 text-xs text-white`}>
          {formatTime(durationMs)}
        </Text>
      )}
    </View>
  )
}

const Scene: FC<SceneProps> = (props) => {
  const { value, tabKey } = props

  const searchApi = useWyCloudApi('cloudsearch')

  const keyExtractor = useCallback(
    (item: any) => {
      if (value === '1002') {
        return `user_item_${item.userId}`
      } else if (value === '1014') {
        return `video_item_${item.vid}`
      } else {
        return `list_item_${item.id}` 
      }
    },
    [value]
  )

  const onCustomApi = useCallback(
    (paging: Paging) => {
      const type = Number(value)

      return new Promise<CustomResponse<any>>((resolve, reject) => {
        searchApi({
          data: {
            s: tabKey,
            type,
            ...paging
          },
          recordUniqueId: `${value}_${tabKey}_${paging.offset}`
        })
          .then(response => {
            const { status, body } = response
            if (status === 200 && body.code === 200) {
              const { result } = body
              const keyObj = resultKey[type as keyof typeof resultKey]

              const count = result[keyObj.count]
              const list = result[keyObj.list]
              const { offset, limit } = paging

              resolve({
                total: count,
                ended: offset * limit >= count,
                list: list
              })
            } else {
              reject('network error')
            }
          })
          .catch((e) => { reject(e) })
      })
    },
    [value]
  )

  const renderItem = useCallback<ListRenderItem<any>>(
    ({ item, index }) => {
      const serial = index + 1

      switch (value) {
        case '1':
          return (
            <SongInfoItem
              index={serial}
              picUrl={item.al?.picUrl}
              name={item.name}
              alName={item.al?.name}
              arName={item.ar?.[0]?.name}
            />
          )
        case '10':
          return (
            <ListItem
              index={serial}
              title={item.name}
              subtitle={formatLineText(item.artist?.alias[0], item.artist?.name)}
              picUrl={item.picUrl}
            />
          )
        case '100':
          return (
            <ListItem
              index={serial}
              title={item.name}
              circlePic
              picUrl={item.picUrl}
              ListItemRight={
                <Button
                  shape="round"
                  ghost
                  size="base"
                >
                  关注
                </Button>
              }
            />
          )
        case '1000':
          return (
            <ListItem
              index={serial}
              title={item.name}
              subtitle={`${item.trackCount ?? 0}首 - by ${item.creator?.nickname}`}
              picUrl={item.coverImgUrl}
            />
          )
        case '1002':
          return (
            <ListItem
              index={serial}
              title={item.nickname}
              subtitle={item.signature}
              picUrl={item.avatarUrl}
              ListItemRight={
                <Button
                  shape="round"
                  ghost
                  size="base"
                >
                  关注
                </Button>
              }
            />
          )
        case '1004':
          return (
            <ListItem
              picUrl={item.cover}
              title={item.name}
              subtitle={item.artistName}
              renderPicImg={(picImgProps) => (
                <PicImg
                  {...picImgProps}
                  durationMs={item.duration / 1000}
                />
              )}
            />
          )
        case '1014':
          return (
            <ListItem
              picUrl={item.coverUrl}
              title={item.title}
              subtitle={item.aliaName ?? ''}
              renderPicImg={(picImgProps) => (
                <PicImg
                  {...picImgProps}
                  durationMs={item.durationms / 1000}
                />
              )}
            />
          )
        default:
          return <></>
      }
    },
    [value]
  )

  return (
    <PagingListFlashList
      estimatedItemSize={100}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onCustomApi={onCustomApi}
    />
  )
}

const ResultTabs: FC<ResultTabs> = (props) => {
  const { value } = props

  const renderScene = useCallback(
    (sceneProps: RenderSceneProps<Route>) => {
      const { key } = sceneProps.route
      return <Scene value={key} tabKey={value} />
    },
    [value]
  )

  return (
    <TabsView
      routes={routes}
      initialPage={0}
      lazy
      tabsBarScrollEnabled
      renderScene={renderScene}
    />
  )
}

export default ResultTabs
