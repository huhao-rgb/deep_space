import {
  memo,
  useCallback,
  useState,
  useEffect,
  useMemo
} from 'react'

import {
  View,
  Text,
  useWindowDimensions
} from 'react-native'

import {
  RectButton,
  BorderlessButton
} from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import Carousel from 'react-native-reanimated-carousel'
import type { CarouselRenderItem } from 'react-native-reanimated-carousel'

import { Image } from 'expo-image'

import Card from './Card'

import { tw, fyShuffle } from '@/utils'
import { useWyCloudApi } from '@/hooks'
import type { StarpickCommentsSummaryRes } from '@/api/types'

import Icon from '@/components/svg-icon'

const linearColors = [
  { startColor: '#F785A9', endColor: '#F4A7BF' },
  { startColor: '#B10BF3', endColor: '#C856F5' },
  { startColor: '#FFA072', endColor: '#F9BC9E' },
  { startColor: '#371665', endColor: '#593888' },
  { startColor: '#656C74', endColor: '#919496' },
  { startColor: '#F9983D', endColor: '#F8B371' }
]

const carouselHeight = 210

const horizontalGap = (tw`w-5`.width as number) * 2

const StarpickComments = memo(() => {
  const { width } = useWindowDimensions()

  const starpickCommentsApi = useWyCloudApi<StarpickCommentsSummaryRes>('starpickCommentsSummary', 1000 * 60 * 60 * 2)

  const [comments, setComments] = useState<any[]>([])
  const randomLinearIndexs = useMemo(() => fyShuffle(linearColors.map((_, i) => i)), [])

  useEffect(
    () => {
      starpickCommentsApi()
        .then(response => {
          const { status, body } = response
          if (status === 200 && body.code === 200) {
            const blockFilter = body.data.blocks?.filter(item =>
              item.blockCode === 'HOMEPAGE_BLOCK_NEW_HOT_COMMENT')?.[0]
            blockFilter.creatives && setComments(blockFilter.creatives)
          }
        })
    },
    []
  )

  const renderItem: CarouselRenderItem<any> = useCallback(
    ({ item, index }) => {
      const current = item.resources?.[0]
      const linearIndex = randomLinearIndexs[index % linearColors.length]
      const linearColor = linearColors[linearIndex]

      return (
        <RectButton
          rippleColor={tw.color('red-100')}
          activeOpacity={0.8}
          style={tw`flex-1 rounded-xl overflow-hidden`}
        >
          <LinearGradient
            colors={[linearColor.startColor, linearColor.endColor]}
            style={tw`flex-1 px-4 py-3 rounded-xl`}
          >
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center flex-1`}>
                <Image
                  source={{
                    uri: `${current?.resourceExtInfo.songData.album.picUrl}?param=40y40`
                  }}
                  style={tw`w-8 h-8 rounded-md`}
                />
                <Text
                  numberOfLines={1}
                  style={tw`ml-2 text-sm flex-1 text-white`}
                >
                  {current?.resourceExtInfo.songData.name} - {current?.resourceExtInfo.songData.album.name}
                </Text>
              </View>
              <BorderlessButton
                style={tw`p-1 ml-2`}
              >
                <Icon
                  name="SolidPlay"
                  width={14}
                  height={14}
                  fill={tw.color('white')}
                />
              </BorderlessButton>
            </View>
            <View style={tw`my-1 flex-row items-center flex-1`}>
              <Text
                numberOfLines={3}
                style={tw`text-2xl font-bold text-white`}
              >
                {current?.uiElement.mainTitle.titleDesc}
              </Text>
            </View>
            <Text style={tw`text-xs text-white`}>{current?.likedCount ?? 0}人觉得攒</Text>
          </LinearGradient>
        </RectButton>
      )
    },
    [randomLinearIndexs]
  )

  if (comments.length > 0) {
    return (
      <Card
        text="云村星评馆"
        showMoreText={false}
        style={tw`mt-8`}
      >
        <Carousel
          data={comments}
          width={width - horizontalGap}
          height={carouselHeight}
          autoPlay={false}
          mode="horizontal-stack"
          modeConfig={{
            snapDirection: 'left',
            stackInterval: 16
          }}
          style={[
            tw`w-full items-center justify-center`,
            { height: carouselHeight }
          ]}
          renderItem={renderItem}
        />
      </Card>
    )
  }

  return null
})

export default StarpickComments
