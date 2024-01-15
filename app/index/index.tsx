import type { FC } from 'react'
import {
  useState,
  useEffect,
  useCallback
} from 'react'

import {
  Text,
  View,
  ScrollView
} from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableOpacity, RectButton } from 'react-native-gesture-handler'
import Lottie from 'lottie-react-native'

import { router } from 'expo-router'

import { useShallow } from 'zustand/react/shallow'

import SearchBox from './SearchBox'
import Navs from './Navs'
import Card from './Card'

import Reommend from './Reommend'
import TrackPager from './TrackPager'
import RadarSongList from './RadarSongList'
import StarpickComments from './StarpickComments'

import Icon from '@/components/svg-icon'

import { useWyCloudApi, useTrack } from '@/hooks'
import { tw } from '@/utils'
import type { WyCloudDecodeAnswer } from '@/utils'
import { usePlayer } from '@/store'

import type {
  HomepageBlockPageRes,
  HomepageBlockPageBlocks,
  PlaylistTrackAllRes
} from '@/api/types'

interface PageState {
  blocks: HomepageBlockPageBlocks[]
  cursor?: string
}

enum PageError {
  NETERROR = 0
}

const showPageType = [
  'HOMEPAGE_BLOCK_PLAYLIST_RCMD',
  'HOMEPAGE_BLOCK_STYLE_RCMD',
  'HOMEPAGE_BLOCK_MGC_PLAYLIST',
  'HOMEPAGE_BLOCK_TOPLIST'
]
const showMoreTexts = ['HOMEPAGE_BLOCK_PLAYLIST_RCMD', 'HOMEPAGE_BLOCK_MGC_PLAYLIST']
const showPlayBtn = ['HOMEPAGE_BLOCK_STYLE_RCMD', 'HOMEPAGE_BLOCK_TOPLIST']

const Home: FC = () => {
  const [setPlayerList] = usePlayer(useShallow((state) => [state.setPlayerList]))

  const wyCloud = useWyCloudApi<HomepageBlockPageRes>('homepageBlockPage')
  const songDefaultApi = useWyCloudApi<PlaylistTrackAllRes>('playlistTrackAll')

  const track = useTrack()

  const [pageState, setPageState] = useState<PageState>({
    blocks: [],
    cursor: undefined
  })
  const [pageError] = useState<PageError>()

  const { top, bottom } = useSafeAreaInsets()

  useEffect(
    () => {
      const setPageData = (data: WyCloudDecodeAnswer<HomepageBlockPageRes>) => {
        const { status, body } = data
        if (status === 200 && body.code === 200) {
          const { blocks, cursor } = body.data
          setPageState({ blocks, cursor })
        }
      }

      wyCloud(
        { data: { refresh: false, cursor: undefined } },
        (data) => { setPageData(data) }
      )
        .then(response => { setPageData(response) })
    },
    []
  )

  const onRightTextPress = useCallback(
    (block: HomepageBlockPageBlocks) => {
      const { blockCode, uiElement } = block
      if (showMoreTexts.indexOf(blockCode) !== -1) {
        const { title } = uiElement.subTitle
        router.push(`/song-list/${title}`)
      }
    },
    []
  )

  const renderPageContent = useCallback(
    (item: HomepageBlockPageBlocks, i: number) => {
      const { blockCode, creatives } = item

      switch (blockCode) {
        case 'HOMEPAGE_BLOCK_PLAYLIST_RCMD':
          return <Reommend data={creatives} />
        case 'HOMEPAGE_BLOCK_STYLE_RCMD':
        case 'HOMEPAGE_BLOCK_TOPLIST':
          return <TrackPager data={creatives} />
        case 'HOMEPAGE_BLOCK_MGC_PLAYLIST':
          return <RadarSongList data={creatives} />
        default:
          return null
      }
    },
    []
  )

  // 播放全部的按钮
  const renderHeadLeftTextEle = useCallback(
    (block: HomepageBlockPageBlocks) => {
      const { blockCode, creatives } = block

      const onPlaySong = async () => {
        try {
          const songs: any[] = []
          creatives.forEach(item => { songs.push(...item.resources) })
          const ids = songs.map(item => item.resourceId)

          const { status, body } = await songDefaultApi({
            data: { ids: ids },
            recordUniqueId: ids.join()
          })

          if (status === 200 && body.code === 200) {
            const songTracks = await track(body.songs)
            setPlayerList(songTracks, true)
          }
        } catch (err) {}
      }

      if (showPlayBtn.indexOf(blockCode) !== -1) {
        return (
          <RectButton
            rippleColor={tw.color('red-200')}
            activeOpacity={0.8}
            style={tw`p-1.5 bg-red-500 rounded-full`}
            onPress={onPlaySong}
          >
            <Icon
              name="SolidPlay"
              fill={tw.color('white')}
              size={8}
              style={{ transform: [{ translateX: 0.5 }] }}
            />
          </RectButton>
        )
      }

      return null
    },
    [songDefaultApi]
  )

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: top,
        paddingBottom: bottom
      }}
    >
      <View style={tw`px-5 mt-4 flex-row justify-between items-center`}>
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-2xl font-bold text-zinc-800`}>深空场</Text>
          </View>
          <Text style={tw`text-sm text-zinc-400/80`}>DeepSpace-探索你喜爱的音乐</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={tw`justify-center items-center w-12 h-12 rounded-full bg-red-100`}
          onPress={() => { router.push('/my/') }}
        >
          <Lottie
            autoPlay
            loop
            source={require('@/assets/lottie/astronaut.json')}
            style={[tw`w-10 h-10`]}
          />
        </TouchableOpacity>
      </View>

      <SearchBox />
      <Navs />

      {pageState.blocks.map((block, i) => {
        if (showPageType.indexOf(block.blockCode) !== -1) {
          return (
            <Card
              text={block.uiElement.subTitle.title}
              key={`page_card_${i}`}
              showMoreText={showMoreTexts.indexOf(block.blockCode) !== -1}
              renderHeadLeftTextEle={() => renderHeadLeftTextEle(block)}
              style={tw`mt-8`}
              onPress={() => { onRightTextPress(block) }}
            >
              {renderPageContent(block, i)}
            </Card>
          )
        }

        return null
      })}

      <StarpickComments />

      <View style={tw`flex-row items-center justify-center`}>
        <Lottie
          autoPlay
          loop
          source={require('@/assets/lottie/moon.json')}
          style={[tw`w-16 h-16`]}
        />
        <Text style={tw`text-sm text-gray-400`}>
          到底了，没有更多内容了
        </Text>
      </View>
    </ScrollView>
  )
}

export default Home