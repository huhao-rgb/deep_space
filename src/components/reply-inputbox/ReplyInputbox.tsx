import type { FC } from 'react'
import { useState, useCallback } from 'react'

import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Textarea from './Textarea'
import {
  INPUT_BG_COLOR,
  PLACEHOLDER,
  PLACEHOLDER_TEXT_COLOR
} from './constants'

import { tw } from '@/utils'
import { activeOpacity } from '@/constants'

const inputHeight = 40

const ReplyInputbox: FC = () => {
  const { bottom } = useSafeAreaInsets()

  const [state, setState] = useState({
    inputValue: '',
    inputFoucs: false
  })

  const onChangeInputValue = useCallback(
    (value: string) => {
      setState({
        inputFoucs: state.inputFoucs,
        inputValue: value
      })
    },
    [state.inputFoucs]
  )

  const onShowTextarea = useCallback(
    () => {
      setState({
        inputValue: state.inputValue,
        inputFoucs: true
      })
    },
    [state.inputValue]
  )

  const onInputBlur = useCallback(
    () => {
      setState({
        inputValue: state.inputValue,
        inputFoucs: false
      })
    },
    [state.inputValue]
  )

  return (
    <View
      style={[
        tw`flex-row items-end pt-2 border-t border-t-gray-100`
      ]}
    >
      {state.inputFoucs
        ? (
            <Textarea
              value={state.inputValue}
              onChangeText={onChangeInputValue}
              onBlur={onInputBlur}
            />
          )
        : (
            <View style={[tw`flex-1 pl-5 pr-2`, { paddingBottom: bottom }]}>
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={onShowTextarea}
              >
                <View
                  style={[
                    tw`px-4 w-full flex-row items-center`,
                    {
                      height: inputHeight,
                      borderRadius: inputHeight / 2,
                      backgroundColor: INPUT_BG_COLOR
                    }
                  ]}
                >
                  <Text
                    style={[
                      { color: PLACEHOLDER_TEXT_COLOR },
                      tw`text-sm`
                    ]}
                  >
                    {PLACEHOLDER}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
      <TouchableOpacity
        activeOpacity={activeOpacity}
        style={[
          { marginBottom: bottom },
          !state.inputFoucs && tw`flex-1 flex-row items-center`
        ]}
      >
        <Text
          style={[
            tw`ml-2 mr-5 text-sm text-gray-400`
          ]}
        >
          发送
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ReplyInputbox
