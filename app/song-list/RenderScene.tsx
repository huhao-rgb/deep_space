import type { FC } from 'react'
import { useCallback, useMemo } from 'react'

import { View } from 'react-native'
import type { ListRenderItem } from '@shopify/flash-list'

import { PagingListFlashList } from '@/components/paging-list'
import type { Paging, CustomResponse } from '@/components/paging-list'
import { PlayListBlock } from '@/components/play-list-block'
import type { Route, RenderSceneProps } from '@/components/tabs-view'

import { tw } from '@/utils'
import { useWyCloudApi } from '@/hooks'
import type { TopPlaylistRes, PlayListItem } from '@/api/types'

type CustomRenderSceneProps = RenderSceneProps<Route> & {
  width: number
}

type KeyExtractor <TItem = any> = (item: TItem, index: number) => string

const NUM_COLUMNS = 3

const pxWidth = tw`w-5`.width as number
const mlWidth = tw`w-2`.width as number

const RenderScene: FC<CustomRenderSceneProps> = (props) => {
  const { width, route } = props

  const topPlaylistApi = useWyCloudApi<TopPlaylistRes>('topPlaylist')

  const coverWidth = useMemo(
    () => {
      const contentWidth = width - (pxWidth * 2 + mlWidth * (NUM_COLUMNS - 1))
      return contentWidth / NUM_COLUMNS
    },
    [width]
  )

  const renderItem = useCallback<ListRenderItem<PlayListItem>>(
    ({ item, index }) => {
      let justify: 'start' | 'end' | 'center'
      const remainder = index % NUM_COLUMNS

      if (remainder === NUM_COLUMNS - 1) {
        justify = 'end'
      } else if (remainder === 0) {
        justify = 'start'
      } else {
        justify = 'center'
      }

      return (
        <View
          style={[
            tw`w-full mb-4 flex-row`,
            tw`justify-${justify}`
          ]}
          key={`song_list_${index}`}
        >
          <PlayListBlock
            imageUrl={item.coverImgUrl}
            name={item.name}
            id={String(item.id)}
            size={coverWidth}
          />
        </View>
      )
    },
    []
  )

  const keyExtractor = useCallback<KeyExtractor<PlayListItem>>(
    (item) => `${item.id}`,
    []
  )

  const onCustomApi = useCallback(
    (paging: Paging) => {
      return new Promise<CustomResponse<PlayListItem>>((resolve, reject) => {
        const { title } = route
        topPlaylistApi({
          data: { ...paging, cat: title },
          recordUniqueId: `${title}_${paging.offset}`
        })
          .then(response => {
            const { status, body } = response
            if (status === 200 && body.code === 200) {
              const { playlists, more, total } = body
              resolve({
                total,
                ended: !more,
                list: playlists
              })
            } else {
              reject('network error')
            }
          })
          .catch((e) => { reject(e) })
      })
    },
    []
  )

  return (
    <PagingListFlashList
      estimatedItemSize={300}
      keyExtractor={keyExtractor}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={{
        paddingHorizontal: pxWidth,
        paddingTop: 15
      }}
      renderItem={renderItem}
      onCustomApi={onCustomApi}
    />
  )
}

export default RenderScene
