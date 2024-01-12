import type { ComponentType } from 'react'
import {
  useRef,
  useEffect,
  useCallback,
  useState
} from 'react'

import { RefreshControl } from 'react-native'
import type { FlashListProps } from '@shopify/flash-list'

import type { WithPagingListProps } from './types'

import { refreshControlColor } from '@/constants'

interface PageState <T = any> {
  loading: boolean
  refresh: boolean
  listLoadEnd: boolean
  list: T[]
}

export function withPagingList <TItem = {}> (
  Component: ComponentType<FlashListProps<TItem>>
) {
  return (props: WithPagingListProps<TItem>) => {
    const {
      limit = 50,
      onCustomApi,
      onEndReachedThreshold = 0.9,
      ...flashListProps
    } = props

    const offsetRef = useRef(0)
    const limitRef = useRef(limit)
    const totalRef = useRef(0)

    const [pageState, setPageState] = useState<PageState<TItem>>({
      loading: false,
      refresh: false,
      listLoadEnd: false,
      list: []
    })

    const setRequestList = useCallback(
      async (isRefresh: boolean = true) => {
        if (onCustomApi) {
          try {
            let refreshObj = {}
            let loadingObj = {}

            if (isRefresh) {
              offsetRef.current = 0
              totalRef.current = 0
              refreshObj = { refresh: true }
            } else {
              loadingObj = { loading: true }
            }

            setPageState({
              ...pageState,
              ...refreshObj,
              ...loadingObj
            })

            const { total, ended, list } = await onCustomApi({
              offset: offsetRef.current,
              limit: limitRef.current
            })

            const listLoadEnd = ended ?? total >= totalRef.current
            offsetRef.current += 1

            const { list: stateList } = pageState

            setPageState({
              loading: false,
              refresh: false,
              listLoadEnd,
              list: isRefresh ? list : [...stateList, ...list]
            })
          } catch (e) {
            setPageState({ ...pageState, loading: false, refresh: false })
            console.error(`请求出错：${e}`)
          }
        }
      },
      [onCustomApi, pageState]
    )

    useEffect(
      () => { setRequestList() },
      []
    )

    const onEndReached = useCallback(
      () => {
        const { listLoadEnd } = pageState
        if (!listLoadEnd) setRequestList(false)
      },
      [pageState]
    )

    return (
      <Component
        data={pageState.list}
        refreshControl={
          <RefreshControl
            refreshing={pageState.refresh}
            colors={[refreshControlColor]}
            onRefresh={setRequestList}
          />
        }
        onEndReachedThreshold={onEndReachedThreshold}
        onEndReached={onEndReached}
        {...flashListProps}
      />
    )
  }
}
