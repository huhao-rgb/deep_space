import type { FC } from 'react'
import {
  useMemo,
  useCallback,
  useState,
  useEffect
} from 'react'

import { useWindowDimensions } from 'react-native'

import SafeAreaView from '@/components/safe-area-view'
import TabsView from '@/components/tabs-view'
import type { Route, RenderSceneProps } from '@/components/tabs-view'

import RenderScene from './RenderScene'

import { tw } from '@/utils'
import { useWyCloudApi } from '@/hooks'
import type {
  PlaylistCatlistRes,
  CatlistItem
} from '@/api/types'

interface State {
  catListData: {
    categories: Record<number, string>
    sub: CatlistItem[]
  } | undefined,
  loading: boolean
}

const SongList: FC = () => {
  const { width } = useWindowDimensions()

  const catListApi = useWyCloudApi<PlaylistCatlistRes>('playlistCatlist')

  const [state, setState] = useState<State>({
    catListData: undefined,
    loading: false
  })

  useEffect(
    () => {
      catListApi()
        .then(response => {
          const { status, body } = response
          if (status === 200 && body.code === 200) {
            const { all, sub, categories } = body
            const subs = [all, ...sub]
            setState({
              catListData: { sub: subs, categories },
              loading: false
            })
          }
        })
    },
    []
  )

  const routes = useMemo<Route[]>(
    () => {
      if (state?.catListData?.sub?.length) {
        return state.catListData.sub
          .filter(item => item.hot)
          .map((cat, i) => ({
            key: `route_${i}`,
            title: cat.name,
            testID: `route_test_${i}`
          }))
      }

      return []
    },
    [state]
  )

  const renderScene = useCallback(
    (props: RenderSceneProps<Route>) => (
      <RenderScene width={width} {...props} />
    ),
    [width]
  )

  return (
    <SafeAreaView
      edges={['top']}
      style={tw`flex-1`}
    >
      <TabsView
        routes={routes}
        initialPage={0}
        lazy
        tabsBarScrollEnabled={true}
        renderScene={renderScene}
      />
    </SafeAreaView>
  )
}

export default SongList
