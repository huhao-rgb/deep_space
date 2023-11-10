import type { FC } from 'react'
import {
  useMemo,
  useCallback,
  useImperativeHandle,
  useRef,
  useEffect,
  forwardRef,
  useState
} from 'react'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import type { ListRenderItem } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated'
import { useProgress } from 'react-native-track-player'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import type { BottomSheetFlatListMethods } from '@gorhom/bottom-sheet'

import type { LyricData } from './Player'
import { tw } from '@/utils'

interface LyricProps {
  lyricData?: LyricData
}

export interface LyricRef {
  showLyricContainer: () => void
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

const Lyric = forwardRef<LyricRef, LyricProps>((props, ref) => {
  const { lyricData } = props

  const { position } = useProgress()

  const flatListRef = useRef<BottomSheetFlatListMethods>(null)

  const beging = useRef(false)
  const timer = useRef<NodeJS.Timeout>()

  const opacity = useSharedValue(0)
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

  useEffect(
    () => {
      const { lrcLines } = lyricListData

      let currentNum = 0

      for (let i = 0; i < lrcLines.length; i++) {
        const lrc = lrcLines[i]
        if (position * 1000 <= lrc.time) {
          currentNum = i
          break
        }
      }

      setCurPlayRow(currentNum)
    },
    [position, lyricListData.lrcLines]
  )

  useEffect(
    () => {
      console.log('歌词行数变了', curPlayRow)
      if (lyricListData.lrcLines.length === 0) return

      if (!beging.current) {
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: curPlayRow,
          viewOffset: 100
        })
      }
    },
    [curPlayRow, lyricListData.lrcLines]
  )

  const stylez = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const showLyricContainer = useCallback(
    () => {
      opacity.value = withSpring(
        opacity.value === 0 ? 1 : 0
      )
    },
    [opacity]
  )

  const tap = Gesture.Tap()
    .onEnd(() => {
      runOnJS(showLyricContainer)()
    })

  const renderItem: ListRenderItem<LyricLine> = useCallback(
    ({ item, index }) => {
      const { lrcLines, tlrcLines } = lyricListData

      let tlyricLines: LyricLine | undefined

      // 计算出翻译歌词的偏差
      if (tlrcLines.length > 0) {
        const skewing = lrcLines.length - tlrcLines.length
        if (skewing > 0) {
          tlyricLines = tlrcLines[index - skewing]
        }
      }

      const selected = curPlayRow === index
      const textStyle = tw.style(selected ? 'text-base text-slate-700/100' : 'text-sm text-slate-700/60')

      return (
        <View style={[tw`py-2`]}>
          <Animated.Text style={[tw`text-center`, textStyle]}>
            {item.txt}
          </Animated.Text>
          {tlyricLines !== undefined && (
            <Text style={[tw`text-center`, textStyle]}>
              {tlyricLines.txt}
            </Text>
          )}
        </View>
      )
    },
    [lyricListData.lrcLines, lyricListData.tlrcLines, curPlayRow]
  )

  const { tlrcLines, contributor, translator, tags } = lyricListData
  const extraData = Object.assign({}, { tlrcLines, contributor, translator, tags })

  const onScrollBegin = useCallback(
    () => {
      if (timer.current === undefined) {
        clearTimeout(timer.current)
        timer.current = undefined
      }

      beging.current = true
    },
    []
  )

  const onScrollEnd = useCallback(
    () => {
      timer.current = setTimeout(() => {
        beging.current = false
      }, 2000)
    },
    []
  )

  useImperativeHandle(ref, () => ({
    showLyricContainer
  }))

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        tw`z-10 py-4 bg-white`,
        stylez
      ]}
    >
      <GestureDetector gesture={tap}>
        <BottomSheetFlatList
          ref={flatListRef}
          data={lyricListData.lrcLines}
          keyExtractor={(_, i) => `lyric_row_${i}`}
          extraData={extraData}
          renderItem={renderItem}
          style={tw`flex-1`}
          onScrollBeginDrag={onScrollBegin}
          onScrollEndDrag={onScrollEnd}
        />
      </GestureDetector>
    </Animated.View>
  )
})

export default Lyric
