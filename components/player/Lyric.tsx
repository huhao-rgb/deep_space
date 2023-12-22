// https://github.com/ustbhuangyi/lyric-parser/blob/master/src/index.js
import {
  useMemo,
  useCallback,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  forwardRef,
  memo
} from 'react'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import type { LayoutChangeEvent, ListRenderItem } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated'
import TrackPlayer, { State as TPState } from 'react-native-track-player'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import type { BottomSheetFlatListMethods } from '@gorhom/bottom-sheet'

import { shallow } from 'zustand/shallow'

import type { LyricData } from './Player'

import { tw } from '@/utils'
import {
  usePlayerState,
  usePlayer
} from '@/store'

interface LyricProps {
  lyricData?: LyricData
}

export interface LyricRef {
  showLyricContainer: () => void
  seek: (offset: number) => void
  togglePlay: () => void
}

enum State {
  PAUSED = 0,
  PLAYING = 1
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

const getLryicTextStyle = (selected: boolean) => {
  return [
    tw.style(
      selected
        ? 'text-lg text-slate-700/100'
        : 'text-base text-slate-700/60'
    ),
    tw`text-center`
  ]
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

let state: State
let startStamp: number
let pauseStamp: number

const Lyric = forwardRef<LyricRef, LyricProps>((props, ref) => {
  const { lyricData } = props

  const [playerState] = usePlayerState(
    (s) => [s.playerState],
    shallow
  )
  const [currentPlayIndex] = usePlayer(
    (s) => [s.currentPlayIndex],
    shallow
  )

  const flatListRef = useRef<BottomSheetFlatListMethods>(null)

  const beging = useRef(false)
  const timer = useRef<NodeJS.Timeout>()

  const opacity = useSharedValue(0)
  const placeholderHeight = useSharedValue(0)

  const [curPlayRow, setCurPlayRow] = useState(0)

  const placeholderStyle = useAnimatedStyle(() => ({
    height: placeholderHeight.value
  }))

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

  const stop = useCallback(
    () => {
      state = State.PAUSED
      setCurPlayRow(0)
      clearTimeout(timer.current)
    },
    []
  )

  // startTime - 秒
  const play = useCallback(
    (startTime: number, skipLast?: boolean) => {
      const { lrcLines } = lyricListData

      if (lrcLines.length === 0) return

      state = State.PLAYING
      startStamp = +new Date() - startTime

      let curNum = lrcLines.length - 1
      for (let i = 0; i < lrcLines.length; i++) {
        const lrc = lrcLines[i]
        if (startTime * 1000 <= lrc.time) {
          curNum = i
          break
        }
      }

      if (!skipLast) setCurPlayRow(curNum - 1)

      const _playRest = () => {
        const line = lyricListData.lrcLines[curNum]
        const delay = line.time - (+new Date() - startStamp)

        timer.current = setTimeout(() => {
          setCurPlayRow(curNum++)
          if (curNum < lrcLines.length && state === State.PLAYING) {
            _playRest()
          }
        }, delay)
      }

      if (curNum < lrcLines.length) {
        clearTimeout(timer.current)
        _playRest()
      }
    },
    [lyricListData.lrcLines]
  )

  const togglePlay = useCallback(
    () => {
      const now = +new Date()
      if (state === State.PLAYING) {
        stop()
        pauseStamp = now
      } else {
        state = State.PLAYING
        play((pauseStamp ?? now) - (startStamp ?? now), true)
        pauseStamp = 0
      }
    },
    [stop]
  )

  const seek = useCallback(
    (offset: number) => {
      play(offset)
    },
    [play]
  )

  useEffect(
    () => {
      if (playerState === TPState.Playing) {
        TrackPlayer.getProgress()
          .then(response => {
            const { position } = response
            seek(position)
          })
      } else if (playerState === TPState.Buffering || playerState === TPState.Paused) {
        togglePlay()
      }
    },
    [playerState, play, stop]
  )

  useEffect(
    () => {
      if (lyricListData.lrcLines.length === 0) return

      if (!beging.current && curPlayRow > -1) {
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: curPlayRow,
          viewOffset: placeholderHeight.value
        })
      }
    },
    [curPlayRow, lyricListData.lrcLines]
  )

  useEffect(
    () => {
      if (currentPlayIndex !== -1) setCurPlayRow(0)
    },
    [currentPlayIndex]
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

      return (
        <View style={[tw`py-2`]}>
          <Animated.Text style={getLryicTextStyle(selected)}>
            {item.txt}
          </Animated.Text>
          {tlyricLines !== undefined && (
            <Text style={getLryicTextStyle(selected)}>
              {tlyricLines.txt}
            </Text>
          )}
        </View>
      )
    },
    [lyricListData.lrcLines, lyricListData.tlrcLines, curPlayRow]
  )

  const renderHeader = useCallback(
    () => {
      const keys = Object.keys(lyricListData.tags)

      return (
        <>
          <Animated.View style={placeholderStyle} />

          {keys.map((key, i) => {
            const content = lyricListData.tags[key as TagKey]

            if (key === 'offset') return null

            return (
              <Text style={[...getLryicTextStyle(false), tw`py-2`]}>
                {`${key}：${content}`}
              </Text>
            )
          })}
        </>
      )
    },
    [lyricListData.tags, placeholderStyle]
  )

  const renderFooter = useCallback(
    () => {
      return (
        <>
          {lyricData?.lyricUser && (
            <Text style={[...getLryicTextStyle(false), tw`py-2`]}>
              歌词制作者：{lyricData.lyricUser}
            </Text>
          )}
          {lyricData?.transUser && (
            <Text style={[...getLryicTextStyle(false), tw`py-2`]}>
              歌词翻译者：{lyricData.transUser}
            </Text>
          )}
          <Animated.View style={placeholderStyle} />
        </>
      )
    },
    [lyricData]
  )

  const renderEmpty = useCallback(
    () => {
      return (
        <View style={tw`py-20`}>
          <Text style={getLryicTextStyle(false)}>当前歌曲暂无歌词</Text>
        </View>
      )
    },
    []
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

  const onContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout
      placeholderHeight.value = height / 4
    },
    []
  )

  useImperativeHandle(ref, () => ({
    showLyricContainer,
    seek,
    togglePlay
  }))

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        tw`z-10 py-4 bg-white`,
        stylez
      ]}
      onLayout={onContainerLayout}
    >
      <GestureDetector gesture={tap}>
        <BottomSheetFlatList
          ref={flatListRef}
          data={lyricListData.lrcLines}
          keyExtractor={(_, i) => `lyric_row_${i}`}
          extraData={extraData}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onScrollBeginDrag={onScrollBegin}
          onScrollEndDrag={onScrollEnd}
        />
      </GestureDetector>
    </Animated.View>
  )
})

export default memo(Lyric)
