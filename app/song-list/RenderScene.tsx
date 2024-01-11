import type { FC } from 'react'
import {
  useState,
  useCallback,
  useMemo
} from 'react'

import { useWindowDimensions } from 'react-native'

import { FlashList } from '@shopify/flash-list'
import type { ListRenderItem } from '@shopify/flash-list'

import { PlayListBlock } from '@/components/play-list-block'

import { tw } from '@/utils'

interface State {
  loading: boolean
  refresh: boolean
  list: []
}

const NUM_COLUMNS = 3

const pxWidth = tw`w-5`.width as number
const mlWidth = tw`w-3`.width as number

const RenderScene: FC = () => {
  const { width } = useWindowDimensions()

  const [state, setState] = useState<State>({
    loading: false,
    refresh: false,
    list: []
  })

  const coverWidth = useMemo(
    () => {
      return (width - (pxWidth * 2 - (mlWidth * (NUM_COLUMNS - 1)))) / NUM_COLUMNS
    },
    [width]
  )

  const renderItem = useCallback<ListRenderItem<any>>(
    ({ item, index }) => {
      return (
        <PlayListBlock
          key={`song_list_${index}`}
          style={[
            index % NUM_COLUMNS === 0 && tw`ml-3`,
            tw`mb-2`,
            { width: coverWidth }
          ]}
        />
      )
    },
    []
  )

  return (
    <FlashList
      data={state.list}
      estimatedItemSize={120}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={tw`px-5`}
      renderItem={renderItem}
    />
  )
}

export default RenderScene
