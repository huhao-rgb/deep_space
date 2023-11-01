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
import { TouchableOpacity } from 'react-native-gesture-handler'
import Lottie from 'lottie-react-native'
import { useMMKVString } from 'react-native-mmkv'

import SearchBox from './SearchBox'
import Navs from './Navs'
import Card from './Card'

import Reommend from './Reommend'
import TrackPager from './TrackPager'
import RadarSongList from './RadarSongList'
import StarpickComments from './StarpickComments'

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

const showPageType = ['HOMEPAGE_BLOCK_PLAYLIST_RCMD', 'HOMEPAGE_BLOCK_STYLE_RCMD', 'HOMEPAGE_BLOCK_MGC_PLAYLIST']

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
      if (anonymousToken) {
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
      }
    },
    [anonymousToken]
  )

  const renderPageContent = useCallback(
    (item: HomepageBlockPageBlocks, i: number) => {
      const { blockCode } = item

      switch (blockCode) {
        case 'HOMEPAGE_BLOCK_PLAYLIST_RCMD':
          return <Reommend data={item.creatives} />
        case 'HOMEPAGE_BLOCK_STYLE_RCMD':
          return <TrackPager data={item.creatives} />
        case 'HOMEPAGE_BLOCK_MGC_PLAYLIST':
          return <RadarSongList data={item.creatives} />
        default:
          return null
      }
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
              style={tw`mt-8`}
              key={`page_card_${i}`}
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