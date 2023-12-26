import type { FC } from 'react'
import { useMemo, useCallback } from 'react'

import { BorderlessButton } from 'react-native-gesture-handler'
import { shallow } from 'zustand/shallow'
import { usePlayer, PlayerRepeatMode } from '@/store'

import Icon from '@/components/svg-icon/Icon'

import { getSvgProps } from '@/utils'

interface RepeatModeBtnProps {
  size: number
  color?: string
}

const modeOrder = [
  PlayerRepeatMode.Sequential,
  PlayerRepeatMode.Random,
  PlayerRepeatMode.Single
]
const modeOrderLen = modeOrder.length

const RepeatModeBtn: FC<RepeatModeBtnProps> = (props) => {
  const { size, color } = props

  const [repeatMode, setRepeatMode] = usePlayer(
    (s) => [s.repeatMode, s.setRepeatMode],
    shallow
  )

  const iconName = useMemo(
    () => {
      if (repeatMode === PlayerRepeatMode.Sequential) {
        return 'OutlineRepeateMusic'
      } else if (repeatMode === PlayerRepeatMode.Random) {
        return 'OutlineShuffle'
      } else if (repeatMode === PlayerRepeatMode.Single) {
        return 'OutlineRepeateOne'
      } else {
        return ''
      }
    },
    [repeatMode]
  )

  const changeMode = useCallback(
    () => {
      const findModeIndex = modeOrder.findIndex(item => item === repeatMode)
      if (findModeIndex !== -1) {
        const orderIndex = findModeIndex === modeOrderLen - 1
          ? 0
          : findModeIndex + 1
        setRepeatMode(modeOrder[orderIndex])
      }
    },
    [repeatMode]
  )

  return (
    <BorderlessButton onPress={changeMode}>
      <Icon
        name={iconName}
        {...getSvgProps({ size: 'lg', theme: 'light', isOutline: false })}
      />
    </BorderlessButton>
  )
}

export default RepeatModeBtn
