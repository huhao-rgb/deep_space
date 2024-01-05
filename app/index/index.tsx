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
import { useMMKVString } from 'react-native-mmkv'

import { router } from 'expo-router'

import SearchBox from './SearchBox'
import Navs from './Navs'
import Card from './Card'

import Reommend from './Reommend'
import TrackPager from './TrackPager'
import RadarSongList from './RadarSongList'
import StarpickComments from './StarpickComments'

import Icon from '@/components/svg-icon'
import toast from '@/components/toast'

import { useWyCloudApi } from '@/hooks'
import { tw } from '@/utils'
import { ANONYMOUS_TOKEN } from '@/constants'

import type {
  HomepageBlockPageRes,
  HomepageBlockPageBlocks
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
  const [anonymousToken] = useMMKVString(ANONYMOUS_TOKEN)

  const wyCloud = useWyCloudApi<HomepageBlockPageRes>('homepageBlockPage', 1000 * 60 * 60 * 2)

  const [pageState, setPageState] = useState<PageState>({
    blocks: [],
    cursor: undefined
  })
  const [pageError] = useState<PageError>()

  const { top, bottom } = useSafeAreaInsets()

  useEffect(
    () => {
      wyCloud({
        data: {
          refresh: false,
          cursor: undefined
        }
      })
        .then(response => {
          const { status, body } = response
          if (status === 200 && body.code === 200) {
            const { blocks, cursor } = body.data
            setPageState({ blocks, cursor })
          }
        })
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

  const onRightTextPress = useCallback(
    (block: HomepageBlockPageBlocks) => {
      const { blockCode } = block
      if (showMoreTexts.indexOf(blockCode) !== -1) {
      }
    },
    []
  )

  // 播放全部的按钮
  const renderHeadLeftTextEle = useCallback(
    (block: HomepageBlockPageBlocks) => {
      const { blockCode } = block

      const onPlaySong = () => {
        toast.success('主动测试toast')
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
    []
  )

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: top,
        paddingBottom: bottom
      }}
      style={tw`bg-white`}
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