import type { FC } from 'react'
import {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect
} from 'react'

import { View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import type { ListRenderItem } from '@shopify/flash-list'

import { PlayListBlock } from '@/components/play-list-block'
import type { Route, RenderSceneProps } from '@/components/tabs-view'

import { tw } from '@/utils'
import { useWyCloudApi } from '@/hooks'
import type { TopPlaylistRes, PlayListItem } from '@/api/types'

type CustomRenderSceneProps = RenderSceneProps<Route> & {
  width: number
}

interface State {
  loading: boolean
  refresh: boolean
  listLoadEnd: boolean
  list: PlayListItem[]
}

const NUM_COLUMNS = 3

const pxWidth = tw`w-5`.width as number
const mlWidth = tw`w-2`.width as number

const RenderScene: FC<CustomRenderSceneProps> = (props) => {
  const { width, route } = props

  const offset = useRef(0)

  const topPlaylistApi = useWyCloudApi<TopPlaylistRes>('topPlaylist')

  const [state, setState] = useState<State>({
    loading: false,
    refresh: false,
    listLoadEnd: false,
    list: []
  })

  const coverWidth = useMemo(
    () => {
      const contentWidth = width - (pxWidth * 2 + mlWidth * (NUM_COLUMNS - 1))
      return contentWidth / NUM_COLUMNS
    },
    [width]
  )

  useEffect(
    () => {
      const { title } = route
      topPlaylistApi({
        data: {
          offset: offset.current,
          limit: 50,
          cat: title
        },
        recordUniqueId: `${title}_${offset.current}`
      })
        .then(response => {
          const { status, body } = response
          if (status === 200 && body.code === 200) {
            const { playlists, more, total } = body
            setState({
              loading: false,
              refresh: false,
              listLoadEnd: !more,
              list: playlists
            })
          }
        })
      // topPlaylistApi()
    },
    []
  )

  const renderItem = useCallback<ListRenderItem<any>>(
    ({ item, index }) => {
      let justify = 'start'
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
            id={item.id}
            size={coverWidth}
          />
        </View>
      )
    },
    []
  )

  return (
    <FlashList
      data={state.list}
      estimatedItemSize={300}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={{
        paddingHorizontal: pxWidth,
        paddingTop: 15
      }}
      
      renderItem={renderItem}
    />
  )
}

export default RenderScene
