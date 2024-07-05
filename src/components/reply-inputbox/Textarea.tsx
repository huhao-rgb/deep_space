import type { FC } from 'react'

import { TextInput } from 'react-native'
import type { TextInputProps } from 'react-native'

import { tw } from '@/utils'

import {
  PLACEHOLDER,
  PLACEHOLDER_TEXT_COLOR,
  INPUT_BG_COLOR
} from './constants'

type TextareaProps =
Omit<
TextInputProps,
| 'multiline'
| 'numberOfLines'
| 'autoFocus'
>

const Textarea: FC<TextareaProps> = (props) => {
  const {
    style,
    placeholder = PLACEHOLDER,
    placeholderTextColor = PLACEHOLDER_TEXT_COLOR,
    ...textinputProps
  } = props

  return (
    <TextInput
      multiline
      numberOfLines={4}
      autoFocus
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      {...textinputProps}
      style={[
        tw`ml-5 flex-1 px-4 py-2 text-sm text-gray-800 rounded-md`,
        { backgroundColor: INPUT_BG_COLOR },
        style
      ]}
    />
  )
}

export default Textarea
