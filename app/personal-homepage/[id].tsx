import type { FC, ReactNode } from 'react'
import {
  useCallback,
  useState,
  useMemo
} from 'react'

import {
  StatusBar,
  Text,
  View
} from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { TabView } from '@showtime-xyz/tab-view'
import type { Route } from '@showtime-xyz/tab-view'
import type { SceneRendererProps } from 'react-native-tab-view'

import TabFlashList from '@/components/tab-flash-list'

import Header from './Header'
import Home from './Home'

const StatusBarHeight = StatusBar.currentHeight ?? 0

type RenderScene = (props: SceneRendererProps & { route: Route }) => ReactNode

const TabScene = ({ route }: any) => {
  return (
    <TabFlashList
      index={route.index}
      data={new Array(20).fill(0)}
      estimatedItemSize={60}
      renderItem={({ index }) => {
        return (
          <View
            style={{
              height: 60,
              backgroundColor: '#fff',
              marginBottom: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>{`${route.title}-Item-${index}`}</Text>
          </View>
        )
      }}
    />
  )
}

const PersonalHomepage: FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [index, setIndex] = useState(0)

  const routes = useMemo<Route[]>(
    () => [
      { key: 'like', title: 'Like', index: 0 },
      { key: 'owner', title: 'Owner', index: 1 },
      { key: 'created', title: 'Created', index: 2 }
    ],
    []
  )

  const animationHeaderPosition = useSharedValue(0)
  const animationHeaderHeight = useSharedValue(0)

  const onStartRefresh = async () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 300)
  }

  const renderScene = useCallback<RenderScene>(
    ({ route }) => {
      switch (route.key) {
        case 'like':
          return <Home route={route} />
        case 'owner':
          return <TabScene route={route} />
        case 'created':
          return <TabScene route={route} />
        default:
          return null
      }
    },
    []
  )

  const renderHeader = useCallback(
    () => <Header />,
    []
  )

  return (
    <TabView
      isRefreshing={isRefreshing}
      navigationState={{ index, routes }}
      lazy
      renderScrollHeader={renderHeader}
      renderScene={renderScene}
      minHeaderHeight={44 + StatusBarHeight}
      animationHeaderPosition={animationHeaderPosition}
      animationHeaderHeight={animationHeaderHeight}
      enableGestureRunOnJS={false}
      onStartRefresh={onStartRefresh}
      onIndexChange={setIndex}
    />
  )
}

export default PersonalHomepage
