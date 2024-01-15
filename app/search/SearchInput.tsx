import type { FC, ReactNode } from 'react'
import {
  useState,
  useRef,
  useCallback,
  useMemo
} from 'react'

import { View, TextInput } from 'react-native'
import type {
  TextInputProps,
  StyleProp,
  ViewStyle
} from 'react-native'

import Animated, {
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid'

import { tw, getSvgProps } from '@/utils'

type SearchInputProps = Omit<
TextInputProps,
| 'value'
| 'multiline'
| 'onBlur'
| 'onFocus'
| 'onChange'
| 'onChangeText'
> & {
  containerStyle?: StyleProp<ViewStyle>
  onSeach?: (value: string) => void
  searchIcon?: () => ReactNode
}

const SearchIcon: FC = () => {
  return (
    <TouchableOpacity>
      <View style={tw`h-full px-4 items-center`}>
        <MagnifyingGlassIcon
          {...getSvgProps({
            theme: 'light',
            size: 'lg',
            isOutline: false
          })}
        />
      </View>
    </TouchableOpacity>
  )
}

const SearchInput: FC<SearchInputProps> = (props) => {
  const {
    editable,
    returnKeyType = 'search',
    placeholderTextColor = tw.color('gray-400'),
    containerStyle,
    searchIcon: customSearchIcon,
    ...textInputProps
  } = props

  const inputRef = useRef<TextInput>(null)

  const [foucs, setFoucs] = useState(false)
  const [inputValue, setInputValue] = useState('')

  // const stylez = useAnimatedStyle(() => ({
  //   borderColor: withSpring(tw.color(foucs ? 'red-500' : 'slate-50') as any)
  // }))

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

  const searchIcon = useMemo(
    () => customSearchIcon
      ? customSearchIcon
      : () => <SearchIcon />,
    [customSearchIcon]
  )

  return (
    <Animated.View
      style={[
        tw`flex-row items-center bg-gray-100/80 border rounded-xl`,
        containerStyle,
        { borderColor: tw.color(foucs ? 'red-400' : 'gray-100/80') }
      ]}
    >
      <TextInput
        ref={inputRef}
        value={inputValue}
        multiline={false}
        editable={editable}
        returnKeyType={returnKeyType}
        placeholderTextColor={placeholderTextColor}
        style={tw`flex-1 py-2 ml-4 text-sm text-gray-800`}
        {...textInputProps}
        onBlur={onBlur}
        onFocus={onFocus}
        onChangeText={setInputValue}
      />
      {searchIcon()}
    </Animated.View>
  )
}

export default SearchInput
