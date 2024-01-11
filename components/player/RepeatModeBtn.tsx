import type { FC } from 'react'
import { useMemo, useCallback } from 'react'

import { BorderlessButton } from 'react-native-gesture-handler'
import { useShallow } from 'zustand/react/shallow'
import { usePlayer, PlayerRepeatMode } from '@/store'

import Icon from '@/components/svg-icon/Icon'

import { getSvgProps } from '@/utils'

interface RepeatModeBtnProps {
  mode: PlayerRepeatMode
}

const modeOrder = [
  PlayerRepeatMode.Sequential,
  PlayerRepeatMode.Random,
  PlayerRepeatMode.Single
]
const modeOrderLen = modeOrder.length

const RepeatModeBtn: FC<RepeatModeBtnProps> = (props) => {
  const { mode } = props

  const [setRepeatMode] = usePlayer(useShallow((s) => [s.setRepeatMode]))

  const iconName = useMemo(
    () => {
      if (mode === PlayerRepeatMode.Sequential) {
        return 'OutlineRepeateMusic'
      } else if (mode === PlayerRepeatMode.Random) {
        return 'OutlineShuffle'
      } else if (mode === PlayerRepeatMode.Single) {
        return 'OutlineRepeateOne'
      } else {
        return ''
      }
    },
    [mode]
  )

  const changeMode = useCallback(
    () => {
      const findModeIndex = modeOrder.findIndex(item => item === mode)
      if (findModeIndex !== -1) {
        const orderIndex = findModeIndex === modeOrderLen - 1
          ? 0
          : findModeIndex + 1
        setRepeatMode(modeOrder[orderIndex])
      }
    },
    [mode]
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
