import type { FC } from 'react'
import {
  useState,
  useCallback,
  useMemo,
  useRef
} from 'react'

import { View, Text } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'

import { useGlobalSearchParams } from 'expo-router'

import {
  TouchableOpacity,
  RectButton,
  ScrollView
} from 'react-native-gesture-handler'
import { TrashIcon } from 'react-native-heroicons/outline'
import { useMMKVString } from 'react-native-mmkv'
import { XMarkIcon } from 'react-native-heroicons/solid'

import { useShallow } from 'zustand/react/shallow'

import ResultTabs from './ResultTabs'

import { getSvgProps, tw } from '@/utils'
import { activeOpacity, SEARCH_HISTORY } from '@/constants'
import { useSystem } from '@/store'

import SearchInput from './SearchInput'
import type { SearchInputRef } from './SearchInput'

interface HistoryItemProps {
  text: string
  style?: StyleProp<ViewStyle>
  onSearch?: (text: string) => void
}

const HistoryItem: FC<HistoryItemProps> = ({
  text,
  style,
  onSearch
}) => {
  const onPress = useCallback(
    () => { onSearch?.(text) },
    [onSearch, text]
  )

  return (
    <RectButton
      activeOpacity={activeOpacity}
      rippleColor={tw.color('red-200')}
      style={[
        tw`px-4 h-8 bg-gray-100 rounded-full items-center flex-row`,
        style
      ]}
      onPress={onPress}
    >
      <Text style={tw`text-sm text-gray-800`}>{text}</Text>
    </RectButton>
  )
}

const Search: FC = () => {
  const { defaultKey } = useGlobalSearchParams()

  const [maxSearchHistoryNumber] = useSystem(useShallow((s) => [s.maxSearchHistoryNumber]))

  const [searchValue, setSearchValue] = useState<string | null>(null)

  const [historyStr, setHistoryStr] = useMMKVString(SEARCH_HISTORY)
  const historys = useMemo<string[]>(
    () => {
      if (typeof historyStr === 'string') return JSON.parse(historyStr)
      return []
    },
    [historyStr]
  )

  const searchInputRef = useRef<SearchInputRef>(null)

  const onSearch = useCallback(
    (value: string) => {
      setSearchValue(value === '' ? null : value)

      if (!value) return

      const newHistorys = [...historys]
      const findIndex = newHistorys.findIndex(item => item === value)

      searchInputRef.current?.changeInputValue(value)

      if (findIndex === -1) {
        newHistorys.unshift(value)
      } else {
        newHistorys.splice(findIndex, 1)
        newHistorys.unshift(value)
      }

      const maxHistoryNum = maxSearchHistoryNumber <= 0
        ? 20
        : maxSearchHistoryNumber
      setHistoryStr(JSON.stringify(newHistorys.slice(0, maxHistoryNum)))
    },
    [historys, maxSearchHistoryNumber]
  )

  const onRemoveSearch = useCallback(
    () => {
      searchInputRef.current?.changeInputValue('')
      searchInputRef.current?.blur?.()
      setSearchValue(null)
    },
    []
  )

  const onRemoveHistory = useCallback(
    () => {},
    []
  )

  const searchIcon = useCallback(
    () => {
      return (
        <XMarkIcon
          {...getSvgProps({
            fill: tw.color('gray-500'),
            size: 'base',
            isOutline: false
          })}
        />
      )
    },
    []
  )

  return (
    <>
      <SearchInput
        ref={searchInputRef}
        defaultValue={searchValue ?? ''}
        placeholder={defaultKey as string}
        containerStyle={tw`mx-5`}
        nonullValueShowRightIcon
        onRightPress={onRemoveSearch}
        onSearch={onSearch}
        searchIcon={searchIcon}
      />

      <View style={tw`mt-4 flex-1`}>
        {searchValue === null 
          ? (
              <View style={tw`px-5`}>
                <View style={tw`flex-row items-center justify-between`}>
                  <Text style={tw`text-lg text-zinc-800 font-bold`}>搜索记录</Text>

                  <TouchableOpacity
                    activeOpacity={activeOpacity}
                    style={tw`flex-row items-center`}
                    onPress={onRemoveHistory}
                  >
                    <TrashIcon
                      {...getSvgProps({
                        color: tw.color('gray-500'),
                        size: 'base'
                      })}
                    />
                    <Text style={tw`ml-1 text-sm text-gray-500`}>清除记录</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={tw`flex-row items-center flex-wrap`}>
                  {historys.map((text, i) => (
                    <HistoryItem
                      text={text}
                      key={`history_item_${i}`}
                      style={tw`mr-3 my-3`}
                      onSearch={onSearch}
                    />
                  ))}
                </ScrollView>
              </View>
            )
          : <ResultTabs value={searchValue} />}
      </View>
    </>
  )
}

export default Search
