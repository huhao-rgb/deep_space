import type { FC } from 'react'
import { useMemo, useCallback } from 'react'

import { Text } from 'react-native'

import SafeAreaView from '@/components/safe-area-view'
import TabsView from '@/components/tabs-view'
import type { Route, RenderSceneProps } from '@/components/tabs-view'

import { tw } from '@/utils'

const SongList: FC = () => {
  const routes = useMemo<Route[]>(
    () => {
      return new Array(10)
        .fill('')
        .map((_, index) => ({
          key: `route_${index}`,
          title: `标签${index + 1}`,
          testID: `route_test_${index}`
        }))
    },
    []
  )

  const renderScene = useCallback(
    (props: RenderSceneProps<Route>) => {
      return (
        <Text>123123</Text>
      )
    },
    []
  )

  return (
    <SafeAreaView
      edges={['top']}
      style={tw`flex-1`}
    >
      <TabsView
        routes={routes}
        initialPage={0}
        tabsBarScrollEnabled={true}
        renderScene={renderScene}
      />
    </SafeAreaView>
  )
}

export default SongList
