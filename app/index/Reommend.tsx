import type { FC } from 'react'

import {
  ScrollView,
  View,
  Text
} from 'react-native'

import { RectButton } from 'react-native-gesture-handler'

import { router } from 'expo-router'

import { useShallow } from 'zustand/react/shallow'

import SongListCover from './SongListCover'

import { tw } from '@/utils'
import { useWyCloudApi, useTrack } from '@/hooks'
import { useSystem, usePlayer } from '@/store'
import type { PlaylistDetailRes, PlaylistTrackAllRes } from '@/api/types'

interface Props {
  data: any[]
}

const Reommend: FC<Props> = (props) => {
  const { data } = props

  const [cacheDuration] = useSystem(useShallow(s => [s.cacheDuration]))
  const [setPlayerList] = usePlayer(useShallow((s) => [s.setPlayerList]))

  const detailApi = useWyCloudApi<PlaylistDetailRes>('playlistDetail', cacheDuration)
  const songDefaultApi = useWyCloudApi<PlaylistTrackAllRes>('playlistTrackAll', cacheDuration)

  const track = useTrack()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`px-5`}
    >
      {data.map((item, i) => {
        const openSongListDetailPage = (item: any) => {
          if (item.creativeId) {
            router.push(`/song-list-detail/${item.creativeId}`)
          }
        }

        const onPlayAll = async () => {
          const { creativeId } = item
          const detailRes = await detailApi({
            data: { id: creativeId },
            recordUniqueId: creativeId as string
          })
          const { status, body } = detailRes

          if (status === 200 && body.code === 200) {
            const { trackIds } = body.playlist

            const { status: songStatus, body: songBody } = await songDefaultApi({
              data: { ids: trackIds },
              recordUniqueId: trackIds.join()
            })
  
            if (songStatus === 200 && songBody.code === 200) {
              const songTracks = await track(songBody.songs)
              setPlayerList(songTracks, true)
            }
          }
        }

        return (
          <RectButton
            key={`recommend_${i}`}
            borderless={false}
            rippleColor={tw.color('red-100')}
            activeOpacity={0.8}
            onPress={openSongListDetailPage}
          >
            <View
              style={[
                tw`w-28`,
                i !== 0 && i !== data.length - 1 && tw`mx-1`,
                i === 0 && tw`mr-1`,
                i === data.length - 1 && tw`ml-1`
              ]}
            >
              <SongListCover
                cover={item.uiElement.image.imageUrl}
                onPlay={onPlayAll}
              />
              <Text
                style={[tw`mt-1 text-gray-800 text-sm`]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.uiElement.mainTitle.title}
              </Text>
            </View>
          </RectButton>
        )
      })}
    </ScrollView>
  )
}

export default Reommend
