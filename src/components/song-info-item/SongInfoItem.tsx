import type { FC } from 'react'
import { useMemo, useCallback } from 'react'

import { Text, View } from 'react-native'

import { BorderlessButton } from 'react-native-gesture-handler'

import type { SongInfoItemProps } from './types'
import ListItem from '../list-item'
import type { RenderInfoProps } from '../list-item'

import { tw } from '@/utils'

import VipLabel from '../vip-label'
import Icon from '../svg-icon'

const SongInfoItem: FC<SongInfoItemProps> = (props) => {
  const {
    index,
    picUrl,
    isVip,
    name,
    alName,
    arName,
    showMvIcon = false,
    onPress,
    onToMv,
    onMore
  } = props

  const isShowLine = useMemo(
    () => [alName, arName].filter(item => item !== undefined).length,
    [alName, arName]
  )

  const renderInfo = useCallback(
    (infoProps: RenderInfoProps) => {
      const { title, subtitle } = infoProps

      return (
        <View style={tw`flex-1`}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={tw`text-base text-slate-800`}
          >
            {title}
          </Text>
          <View style={tw`w-full flex-row items-center mt-1`}>
            {isVip && <VipLabel />}
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`flex-1 text-xs text-slate-500`}
            >
              {subtitle}
            </Text>
          </View>
        </View>
      )
    },
    []
  )

  return (
    <ListItem
      index={index}
      title={name}
      subtitle={`${alName} ${isShowLine === 2 ? '-' : ''} ${arName}`}
      picUrl={picUrl}
      renderInfo={renderInfo}
      ListItemRight={
        <View style={tw`flex-row items-center`}>
          {showMvIcon && (
            <BorderlessButton
              style={tw`mr-4`}
              onPress={onToMv}
            >
              <View style={tw`p-1`}>
                <Icon
                  name="MvVideo"
                  size={22}
                  fill={tw.color('slate-600')}
                />
              </View>
            </BorderlessButton>
          )}
          <BorderlessButton
            style={{ transform: [{ translateX: 3 }] }}
            onPress={onMore}
          >
            <View style={tw`p-1`}>
              <Icon
                name="VerticalMore"
                size={18}
                fill={tw.color('slate-600')}
              />
            </View>
          </BorderlessButton>
        </View>
      }
      onPress={onPress}
    />
  )
}

export default SongInfoItem
