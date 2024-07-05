import type { FC } from 'react'
import { useCallback, useMemo } from 'react'

import { View, Text } from 'react-native'

import { RectButton } from 'react-native-gesture-handler'
import { Image } from 'expo-image'

import type { ListItemProps } from './types'
import RenderInfo from './RenderInfo'

import { rippleColor } from '@/constants'
import { tw } from '@/utils'

const ListItem: FC<ListItemProps> = (props) => {
  const {
    index,
    picUrl,
    picUrlSize = 80,
    circlePic = false,
    renderInfo: customRenderInfo,
    renderPicImg: customRenderPicImg,
    title,
    subtitle,
    titleStyle,
    subtitleStyle,
    ListItemRight,
    onPress
  } = props

  const paddingStyle = useMemo(
    () => index === undefined ? 'px-5' : 'pr-5',
    [index]
  )

  const picUrlStr = useMemo(
    () => {
      if (picUrl !== undefined && picUrl !== '') {
        return `${picUrl}?param=${picUrlSize}y${picUrlSize}`
      }
      return ''
    },
    [picUrl, picUrlSize]
  )

  const renderInfo = useCallback(
    () => {
      if (typeof customRenderInfo === 'function') {
        return customRenderInfo?.({
          title: title ?? '',
          subtitle: subtitle ?? '',
          titleStyle,
          subtitleStyle
        })
      }

      return (
        <RenderInfo
          title={title ?? ''}
          subtitle={subtitle ?? ''}
          titleStyle={titleStyle}
          subtitleStyle={subtitleStyle}
        />
      )
    },
    [
      customRenderInfo,
      title,
      subtitle,
      titleStyle,
      subtitleStyle
    ]
  )

  const renderPicImg = useCallback(
    () => {
      if (typeof customRenderPicImg === 'function') {
        return customRenderPicImg({ picUrl, picUrlSize })
      }

      return picUrlStr && (
        <Image
          source={{ uri: picUrlStr }}
          style={tw`mr-3 w-10 h-10 ${circlePic ? 'rounded-full' : 'rounded-lg'}`}
        />
      )
    },
    [picUrl, picUrlStr, picUrlSize]
  )

  return (
    <RectButton
      borderless={false}
      rippleColor={rippleColor}
      activeOpacity={0.8}
      style={tw`py-2 ${paddingStyle} flex-row items-center`}
      onPress={onPress}
    >
      {index !== undefined && (
        <Text style={tw`w-12 text-center text-sm text-slate-600`}>{index}</Text>
      )}

      <View style={tw`flex-row items-center mr-3 flex-1`}>
        {renderPicImg()}
        {renderInfo()}
      </View>

      {ListItemRight}
    </RectButton>
  )
}

export default ListItem
