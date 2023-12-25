// 歌单详情页
import type { FC } from 'react'
import {
  useEffect,
  useState,
  useCallback
} from 'react'

import { shallow } from 'zustand/shallow'

import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions
} from 'react-native'
import type { LayoutChangeEvent } from 'react-native'
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useDerivedValue
} from 'react-native-reanimated'
import { RectButton, BorderlessButton } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import type { FlashListProps, ListRenderItem } from '@shopify/flash-list'

import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'

import Icon from '@/components/svg-icon'
import NavBar from '@/components/nav-bar'
import VipLabel from '@/components/vip-label'

import { useWyCloudApi, useTrack } from '@/hooks'
import { tw } from '@/utils'
import { usePlayer } from '@/store'

import type {
  PlaylistDetailRes,
  PlaylistTrackAllRes,
  Track,
  TrackId
} from '@/api/types'

interface PageState {
  name: string
  description: string
  commentCount: number,
  subscribedCount: number,
  backgroundCoverUrl: string
  tracks: Track[]
  creator: Record<string, any>
}

const AnimatedFlashList = Animated.createAnimatedComponent<FlashListProps<Track>>(FlashList)

const SongListDetail: FC = () => {
  const cacheMill = 1000 * 60 * 60 * 2

  const detailApi = useWyCloudApi<PlaylistDetailRes>('playlistDetail', cacheMill)
  const allSongApi = useWyCloudApi<PlaylistTrackAllRes>('playlistTrackAll', cacheMill)

  const track = useTrack()
  const [setPlayerList] = usePlayer(
    (s) => [s.setPlayerList],
    shallow
  )

  const { bottom } = useSafeAreaInsets()

  const { id } = useLocalSearchParams()
  const { width } = useWindowDimensions()

  const scrollOffsetY = useSharedValue(0)
  const listHeadHeight = useSharedValue(0)

  const [pageState, setPageState] = useState<PageState>({
    name: '',
    description: '',
    commentCount: 0,
    subscribedCount: 0,
    backgroundCoverUrl: '',
    tracks: [],
    creator: {}
  })
  const [navBarHeight, setNavBarHeight] = useState(0)

  useEffect(
    () => {
      (async () => {
        const detailRes = await detailApi({
          data: { id },
          recordUniqueId: id as string
        })

        const { status, body } = detailRes
        if (status === 200 && body.code === 200) {
          const {
            name,
            description,
            commentCount,
            subscribedCount,
            backgroundCoverUrl,
            coverImgUrl,
            trackIds,
            creator
          } = body.playlist

          let tracks: Track[] = []

          const allSongRes = await allSongApi({
            data: {
              ids: trackIds.map((item: TrackId) => item.id)
                // .map((item: TrackId) => '{"id":' + item.id + '}')
            },
            recordUniqueId: id as string
          })

          if (allSongRes.status === 200 && allSongRes.body.code === 200) {
            tracks = allSongRes.body.songs
          }

          setPageState({
            name,
            description,
            commentCount,
            subscribedCount,
            backgroundCoverUrl: backgroundCoverUrl ?? coverImgUrl,
            tracks,
            creator
          })
        }
      })()
    },
    []
  )

  const limitedHeightValue = useDerivedValue(() => {
    return width - navBarHeight - listHeadHeight.value
  })
  const listHeadStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(
        scrollOffsetY.value,
        [0, limitedHeightValue.value, limitedHeightValue.value + 1],
        [0, 0, 1]
      )
    }]
  }))

  const navBarStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(30, 41, 59, ${interpolate(
      scrollOffsetY.value,
      [0, limitedHeightValue.value, limitedHeightValue.value + 1],
      [0, 1, 1]
    )})`
  }))

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffsetY.value = event.contentOffset.y
    }
  })

  const onNavBarLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setNavBarHeight(event.nativeEvent.layout.height)
    },
    []
  )

  const onBack = useCallback(
    () => {
      const canBack = router.canGoBack()
      canBack ? router.back() : router.replace('/index/')
    },
    []
  )

  const ListHeaderComponent = useCallback(
    () => {
      const onListHeadLayout = (event: LayoutChangeEvent) => {
        listHeadHeight.value = event.nativeEvent.layout.height
      }

      return (
        <View style={{ width, height: width }}>
          <Image
            source={{ uri: `${pageState.backgroundCoverUrl}?param=600y600` }}
            style={{ width, height: width }}
          />
          <View
            style={[
              StyleSheet.absoluteFillObject,
              tw`bg-black/30 z-10`
            ]}
          >
            <View
              style={[
                tw`flex-1 px-5`,
                { paddingTop: navBarHeight }
              ]}
            >
              <View style={tw`my-10 flex-1`}>
                <View style={tw`flex-row items-center`}>
                  <Image
                    source={{ uri: `${pageState.creator?.avatarUrl}?param=200y200` }}
                    style={tw`w-24 h-24 rounded-2xl`}
                  />
                  <View style={tw`flex-1 ml-4`}>
                    <Text style={tw`text-xl text-white font-bold`}>{pageState.name}</Text>
                    <Text style={tw`text-white mt-2 text-sm`}>{pageState.creator?.nickname 
                    ?? pageState.creator?.description}</Text>
                  </View>
                </View>
                <BorderlessButton
                  borderless={false}
                  activeOpacity={0.8}
                  style={tw`w-full flex-row items-center`}
                >
                  <Text
                    numberOfLines={2}
                    style={tw`py-3 w-full text-sm text-white`}
                  >
                    {pageState.description?.replace(/[\r\n]/gm, '')}
                  </Text>
                </BorderlessButton>
              </View>
              <View style={tw`py-3 flex-row justify-center items-center`}>
                <RectButton
                  rippleColor={tw.color('red-100')}
                  activeOpacity={0.8}
                  style={tw`px-6 h-10 rounded-full bg-slate-800/60 flex-row items-center`}
                >
                  <Icon
                    name="Comment"
                    width={18}
                    height={18}
                    fill={tw.color('white')}
                  />
                  <Text style={tw`ml-2 text-white text-xs font-bold`}>{pageState.commentCount}</Text>
                </RectButton>
                <RectButton
                  rippleColor={tw.color('red-100')}
                  activeOpacity={0.8}
                  style={tw`ml-1.5 px-6 h-10 rounded-full bg-red-500 flex-row items-center`}
                >
                  <Icon
                    name="Add"
                    width={20}
                    height={20}
                    fill={tw.color('white')}
                  />
                  <Text style={tw`ml-2 text-white text-xs font-bold`}>{pageState.subscribedCount}</Text>
                </RectButton>
              </View>
            </View>

            <Animated.View
              style={[
                tw` w-full px-5 py-3 bg-white rounded-t-2xl flex-row justify-between items-center`,
                listHeadStyle
              ]}
              onLayout={onListHeadLayout}
            >
              <View style={tw`flex-row items-center`}>
                <RectButton
                  borderless={false}
                  rippleColor={tw.color('red-100')}
                  activeOpacity={0.8}
                  style={tw`rounded-full bg-slate-100`}
                >
                  <View style={tw`flex-row items-center p-2`}>
                    <View style={tw`w-6 h-6 rounded-full bg-slate-700 justify-center items-center`}>
                      <Icon
                        name="SolidPlay"
                        fill={tw.color('white')}
                        width={10}
                        height={10}
                        style={{ transform: [{ translateX: 1 }] }}
                      />
                    </View>
                    <Text style={tw`mx-2 text-sm text-slate-700`}>播放全部</Text>
                  </View>
                </RectButton>
                <Text style={tw`ml-2 text-sm text-slate-500`}>
                  {pageState.tracks.length}首歌曲
                </Text>
              </View>

              <BorderlessButton
                rippleColor={tw.color('gray-200')}
                activeOpacity={0.8}
                style={[
                  tw`px-3`,
                  { transform: [{ translateX: tw`w-3`.width as number }] }
                ]}
              >
                <Icon
                  name="Download"
                  fill={tw.color('slate-500')}
                  width={22}
                  height={22}
                />
              </BorderlessButton>
            </Animated.View>
          </View>
        </View>
      )
    },
    [pageState, width, navBarHeight]
  )

  const renderItem = useCallback<ListRenderItem<Track>>(
    ({ item, index }) => {
      const playSong = () => {
        track([item])
          .then(response => {
            setPlayerList(response[0], false)
          })
      }

      return (
        <RectButton
          borderless={false}
          rippleColor={tw.color('gray-200')}
          activeOpacity={0.8}
          style={tw`py-2 pr-5 flex-row items-center`}
          onPress={playSong}
        >
          <Text style={tw`w-12 text-center text-sm text-slate-600`}>{index + 1}</Text>
          <View style={tw`flex-row items-center mr-3 flex-1`}>
            <Image
              source={{ uri: `${item.al.picUrl}?param=80y80` }}
              style={tw`w-10 h-10 rounded-lg`}
            />
            <View style={tw`ml-3 flex-1`}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={tw`text-base text-slate-800`}
              >
                {item.name}
              </Text>
              <View style={tw`w-full flex-row items-center mt-1`}>
                {item.fee === 1 && <VipLabel />}
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={tw`flex-1 text-xs text-slate-500`}
                >
                  {item.al?.name} - {item.ar?.[0]?.name}
                </Text>
              </View>
            </View>
          </View>
          <View style={tw`flex-row items-center`}>
            {item.mv !== 0 && (
              <BorderlessButton
                style={tw`mr-4`}
              >
                <View style={tw`p-1`}>
                  <Icon
                    name="MvVideo"
                    width={22}
                    height={22}
                    fill={tw.color('slate-600')}
                  />
                </View>
              </BorderlessButton>
            )}
            <BorderlessButton
              style={{ transform: [{ translateX: 3 }] }}
            >
              <View style={tw`p-1`}>
                <Icon
                  name="VerticalMore"
                  width={18}
                  height={18}
                  fill={tw.color('slate-600')}
                />
              </View>
            </BorderlessButton>
          </View>
        </RectButton>
      )
    },
    []
  )

  return (
    <>
      <Animated.View
        style={[
          tw`absolute left-0 right-0 z-20`,
          navBarStyle
        ]}
        onLayout={onNavBarLayout}
      >
        <NavBar
          title={pageState.name}
          bgTransparent
          backIconColor={tw.color('white')}
          titleStyle={tw`text-white`}
          onPress={onBack}
        />
      </Animated.View>
      <AnimatedFlashList
        data={pageState.tracks}
        estimatedItemSize={120}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={{
          backgroundColor: tw.color('white'),
          paddingBottom: bottom
        }}
        renderItem={renderItem}
        onScroll={onScroll}
      />
    </>
  )
}

export default SongListDetail
