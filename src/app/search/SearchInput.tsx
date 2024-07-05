import type { FC, ReactNode } from 'react'
import {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'

import { View, TextInput } from 'react-native'
import type {
  TextInputProps,
  StyleProp,
  ViewStyle
} from 'react-native'

import { TouchableOpacity } from 'react-native-gesture-handler'
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid'

import { tw, getSvgProps } from '@/utils'
import { activeOpacity } from '@/constants'

type SearchInputProps = Omit<
TextInputProps,
| 'value'
| 'multiline'
| 'onBlur'
| 'onFocus'
| 'onChange'
| 'onChangeText'
> & {
  defaultValue?: string
  containerStyle?: StyleProp<ViewStyle>
  /**
   * true 非空值的时候才显示右侧图标
   * false 总是显示右侧图标
   */
  nonullValueShowRightIcon?: boolean
  searchIcon?: () => ReactNode
  onRightPress?: () => void
  onSearch?: (value: string) => void
}

interface SearchIconProps {
  onRightPress?: () => void
  children?: ReactNode
}

export interface SearchInputRef {
  changeInputValue: (value: string) => void
  foucs?: () => void
  blur?: () => void
}

const SearchIcon: FC<SearchIconProps> = ({ children, onRightPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onRightPress}
    >
      <View style={tw`h-full px-4 justify-center items-center`}>
        {children}
      </View>
    </TouchableOpacity>
  )
}

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>((props, ref) => {
  const {
    defaultValue,
    nonullValueShowRightIcon = false,
    editable,
    returnKeyType = 'search',
    placeholderTextColor = tw.color('gray-400'),
    containerStyle,
    searchIcon: customSearchIcon,
    onRightPress,
    onSearch,
    ...textInputProps
  } = props

  const inputRef = useRef<TextInput>(null)

  const [foucs, setFoucs] = useState(false)
  const [inputValue, setInputValue] = useState(defaultValue ?? '')

  const onBlur = useCallback(
    () => {
      if (foucs) setFoucs(false)
    },
    [foucs]
  )

  const onFocus = useCallback(
    () => {
      if (!foucs) setFoucs(true)
    },
    [foucs]
  )

  const onSubmitEditing = useCallback(
    () => { onSearch?.(inputValue) },
    [onSearch, inputValue]
  )

  const showRightIcon = useMemo(
    () => {
      if (
        !nonullValueShowRightIcon ||
        (nonullValueShowRightIcon && inputValue !== '')
      ) return true

      return false
    },
    [nonullValueShowRightIcon, inputValue]
  )

  const rightIcon = useMemo(
    () => {
      const defaultIcon = customSearchIcon
        ? customSearchIcon()
        : (
            <MagnifyingGlassIcon
              {...getSvgProps({
                fill: tw.color('gray-500'),
                size: 'base',
                isOutline: false
              })}
            />
          )

      return (
        <SearchIcon onRightPress={onRightPress}>
          {defaultIcon}
        </SearchIcon>
      )
    },
    [customSearchIcon, onRightPress]
  )

  useImperativeHandle(
    ref,
    () => ({
      changeInputValue: setInputValue,
      foucs: inputRef.current?.focus,
      blur: inputRef.current?.blur
    }),
    []
  )

  return (
    <View
      style={[
        tw`flex-row h-12 items-center bg-gray-100/50 border rounded-xl`,
        containerStyle,
        { borderColor: tw.color(foucs ? 'red-400' : 'gray-100/80') }
      ]}
    >
      <TextInput
        ref={inputRef}
        value={inputValue}
        multiline={false}
        blurOnSubmit={true}
        editable={editable}
        returnKeyType={returnKeyType}
        placeholderTextColor={placeholderTextColor}
        underlineColorAndroid="transparent"
        style={tw`flex-1 py-2 ml-4 text-sm text-gray-800`}
        {...textInputProps}
        onBlur={onBlur}
        onFocus={onFocus}
        onChangeText={setInputValue}
        onSubmitEditing={onSubmitEditing}
      />
      {showRightIcon && rightIcon}
    </View>
  )
})

export default SearchInput
