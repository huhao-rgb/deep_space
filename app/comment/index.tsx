import type { FC } from 'react'
import {
  useState,
  useCallback,
  useRef
} from 'react'

import { Text } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useGlobalSearchParams } from 'expo-router'

import NavBar from '@/components/nav-bar'

interface CommentState {
  list: []
  refresh: boolean
  loading: boolean
}

const Comment: FC = () => {
  const params = useGlobalSearchParams()

  const limit = useRef(20)
  const offset = useRef(0)

  const [commentState] = useState<CommentState>({
    list: [],
    refresh: false,
    loading: true
  })
  console.log('获取到的参数', params)

  const renderItem = useCallback(
    () => {
      return (
        <Text>123123</Text>
      )
    },
    []
  )

  return (
    <>
      <NavBar title="测试头部" />
      <FlashList
        data={commentState.list}
        renderItem={renderItem}
      />
    </>
  )
}

export default Comment
