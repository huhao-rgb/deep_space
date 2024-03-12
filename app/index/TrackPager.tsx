import type { FC } from 'react'
import { useCallback, useMemo } from 'react'

import { useShallow } from 'zustand/react/shallow'

import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import { RectButton } from 'react-native-gesture-handler'

import PageScrollView from '@/components/page-scrollview'
import type { RenderScreenProps } from '@/components/page-scrollview'

import { tw } from '@/utils'
import { usePlayer } from '@/store'
import { useTrack, useWyCloudApi } from '@/hooks'

import type { PlaylistTrackAllRes } from '@/api/types'

interface Props {
  data: any[]
}

const offset = tw.style('w-5').width as number

const TrackPager: FC<Props> = (props) => {
  const { data } = props

  const [setPlayerList] = usePlayer(useShallow((s) => [s.setPlayerList]))

  const songDefaultApi = useWyCloudApi<PlaylistTrackAllRes>('playlistTrackAll')
  const track = useTrack()

  const routes = useMemo(
    () => {
      return data.map((item, i) => ({
        key: `track_pager_${i}`,
        meta: item
      }))
    },
    [data]
  )

  const renderScreen = useCallback(
    (rsProps: RenderScreenProps) => {
      const { route } = rsProps
      const { meta } = route

      const playSong = async (item: any) => {
        try {
          const { resourceId } = item
          const { status, body } = await songDefaultApi({
            data: { ids: [resourceId] },
            recordUniqueId: resourceId as string
          })

          if (status === 200 && body.code === 200) {
            const songTracks = await track(body.songs)
            setPlayerList(songTracks[0], true)
          }
        } catch (err) {}
      }

      return (
        <>
          {meta?.resources?.map((item: any, i: number) => (
            <RectButton
              key={`list-page-${i}`}
              borderless={false}
              rippleColor={tw.color('red-50')}
              activeOpacity={0.8}
              onPress={() => { playSong(item) }}
            >
              <View
                style={[
                  i !== 0 && tw`mt-2`,
                  tw`flex-row items-center`
                ]}
              >
                <Image
                  source={{ uri: `${item.uiElement.image.imageUrl}?param=300y300` }}
                  style={tw`w-20 h-20 rounded-xl bg-gray-100 mr-3`}
                />
                <View style={tw`flex-row items-center flex-1`}>
                  <View style={tw`flex-1 mr-2`}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={tw`text-zinc-600 text-base`}
                    >
                        {item.uiElement.mainTitle?.title}
                      </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={tw`text-zinc-400 text-sm`}
                    >
                      {item.resourceExtInfo.songData.artists?.[0]?.name} - {item.resourceExtInfo.songData.album.name}
                    </Text>
                    <View style={tw`flex-row mt-1`}>
                      {item.uiElement.subTitle?.title && (
                        <Text style={tw`px-3 py-0.5 rounded-full text-xs bg-red-100 text-red-600`}>
                          {item.uiElement.subTitle?.title}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </RectButton>
          ))}
        </>
      )
    },
    []
  )

  return (
    <PageScrollView
      offset={offset}
      routes={routes}
      thresholdValue={0.5}
      paddingHorizontal={offset}
      RenderScreen={renderScreen}
    />
  )
}

export default TrackPager
