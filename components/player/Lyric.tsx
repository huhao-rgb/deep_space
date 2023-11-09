import type { FC } from 'react'
import {
  useMemo,
  useCallback,
  useState
} from 'react'

import { View, Text } from 'react-native'
import type { ListRenderItem } from 'react-native'
import Animated from 'react-native-reanimated'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'

import type { LyricData } from './Player'
import { tw } from '@/utils'

interface LyricProps {
  lyricData?: LyricData
}

const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const tagMaps = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}
type TagKey = keyof typeof tagMaps
interface LyricLine { txt: string, time: number }

type Tags = Record<TagKey, string>

interface LyricMemo {
  contributor: string | null
  translator: string | null
  tags: Tags
  lrcLines: LyricLine[]
  tlrcLines: LyricLine[] // 翻译的歌词，可能没有
}

const parseLyric = (lyric: string) => {
  const lyricRows = lyric.split('\n')

  const tags = {} as Tags
  for (const tag in tagMaps) {
    const matches = lyric.match(new RegExp(`\\[${tagMaps[tag as TagKey]}:([^\\]]*)]`))
    if (matches?.[1]) tags[tag as TagKey] = matches[1]
  }

  const offset = parseInt(tags.offset) || 0
  const lyricLines: LyricLine[] = []

  for (let i = 0; i < lyricRows.length; i++) {
    const row = lyricRows[i]
    const result = timeExp.exec(row) as string[] | null
    if (result !== null) {
      const txt = row.replace(timeExp, '').trim()
      if (txt) {
        lyricLines.push({
          time: parseInt(result[1]) * 60000 + parseInt(result[2]) * 1000 + parseInt(result[3] ?? '0') * 10 + offset,
          txt
        })
      }
    }
  }

  return {
    tags,
    lines: lyricLines
  }
}

const Lyric: FC<LyricProps> = (props) => {
  const { lyricData } = props

  const [curPlayRow, setCurPlayRow] = useState(0)

  const lyricListData = useMemo<LyricMemo>(
    () => {
      const { lrc, tlyric, transUser, lyricUser } = lyricData ?? {}

      let lyricTags = {} as Tags
      let lrcLines: LyricLine[] = []
      let tlyrciLines: LyricLine[] = []

      if (lrc !== undefined) {
        const { tags, lines } = parseLyric(lrc)
        lyricTags = tags
        lrcLines = lines
      }

      if (tlyric) {
        const { lines } = parseLyric(tlyric)
        tlyrciLines = lines
      }

      return {
        tags: lyricTags,
        lrcLines: lrcLines,
        tlrcLines: tlyrciLines,
        contributor: lyricUser ?? '',
        translator: transUser ?? ''
      }
    },
    [lyricData]
  )

  const tap = Gesture.Tap()
    .onStart(() => {})

  const renderItem: ListRenderItem<LyricLine> = useCallback(
    ({ item, index }) => {
      const tlyricLines = lyricListData.tlrcLines[index]
      const isTlyric = tlyricLines !== undefined

      return (
        <View
          style={[
            tw`py-2`,
            { transform: [{ scale: curPlayRow === index ? 1.2 : 1 }] }
          ]}
        >
          <Text style={[tw`text-center text-lg`]}>{item.txt}</Text>
          {isTlyric && (
            <Text style={[tw`text-center text-lg`]}>{tlyricLines.txt}</Text>
          )}
        </View>
      )
    },
    [lyricListData.tlrcLines, curPlayRow]
  )

  const { tlrcLines, contributor, translator, tags } = lyricListData
  const extraData = Object.assign({}, { tlrcLines, contributor, translator, tags })

  return (
    <View style={tw`flex-1`}>
      <GestureDetector gesture={tap}>
        <BottomSheetFlatList
          data={lyricListData.lrcLines}
          keyExtractor={(_, i) => `lyric_row_${i}`}
          extraData={extraData}
          renderItem={renderItem}
          style={tw`flex-1`}
        />
      </GestureDetector>
    </View>
  )
}

export default Lyric
