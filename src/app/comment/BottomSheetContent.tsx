import type { FC } from 'react'
import {
  useRef,
  useState,
  useCallback,
  useEffect
} from 'react'

import { View, Text } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import type { ListRenderItem } from '@shopify/flash-list'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'

import CommentItem from './CommentItem'

import type { ReplyComment, CommentFloorRes } from '@/api/types'
import { useWyCloudApi } from '@/hooks'
import { tw } from '@/utils'

interface PageState <T = any> {
  loading: boolean
  listLoadEnd: boolean
  list: T[]
  countTotal: number
  ownerComment: T | null
}

interface BottomSheetContentProps {
  resourceId: string
  type: string
  parentCommentId: number | null
}

let preRowRecordTime = -1

const BottomSheetContent: FC<BottomSheetContentProps> = (props) => {
  const {
    resourceId,
    type,
    parentCommentId
  } = props

  const flashRef = useRef<FlashList<ReplyComment>>(null)

  const commentFloorApi = useWyCloudApi<CommentFloorRes>('commentFloor')

  const [pageState, setPageState] = useState<PageState<ReplyComment>>({
    loading: false,
    listLoadEnd: false,
    list: [],
    countTotal: 0,
    ownerComment: null
  })

  useEffect(
    () => {
      getCommentFloorData(false)

      return () => {
        preRowRecordTime = -1
      }
    },
    []
  )

  const getCommentFloorData = useCallback(
    (isAdd: boolean = true) => {
      console.log(preRowRecordTime)

      if (parentCommentId && !pageState.listLoadEnd) {
        const defaultLimit = 20

        setPageState({ ...pageState, loading: true })

        commentFloorApi({
          data: {
            parentCommentId,
            type,
            id: resourceId,
            time: preRowRecordTime,
            limit: defaultLimit
          },
          recordUniqueId: `${resourceId}_${type}_${parentCommentId}_${preRowRecordTime}`
        })
          .then(response => {
            const { status, body } = response
            if (status === 200 && body.code === 200) {
              const {
                comments,
                ownerComment,
                totalCount,
                time,
                hasMore
              } = body.data

              if (hasMore) preRowRecordTime = time
              setPageState({
                loading: false,
                listLoadEnd: !hasMore,
                list: isAdd ? [...pageState.list, ...comments] : comments,
                countTotal: pageState.countTotal !== 0 && totalCount === 0
                  ? pageState.countTotal
                  : totalCount,
                ownerComment: pageState.ownerComment !== null && ownerComment == null
                  ? pageState.ownerComment
                  : ownerComment
              })
            } else {
              setPageState({ ...pageState, loading: false })
            }
          })
          .catch(() => {
            setPageState({ ...pageState, loading: false })
          })
      }
    },
    [
      resourceId,
      type,
      parentCommentId,
      pageState
    ]
  )

  const onEndReached = useCallback(
    () => { getCommentFloorData(true) },
    [getCommentFloorData]
  )

  const renderItem = useCallback<ListRenderItem<ReplyComment>>(
    ({ item }) => {
      const {
        user,
        content,
        timeStr,
        likedCount
      } = item

      return (
        <CommentItem
          imgUrl={user.avatarUrl}
          name={user.nickname}
          time={timeStr}
          likeNum={likedCount}
          content={content}
          replyCount={0}
        />
      )
    },
    []
  )

  return (
    <>
      <Text style={tw`pb-2 text-sm font-bold text-slate-500 text-center`}>
        回复（{pageState.countTotal}）
      </Text>
      <FlashList
        ref={flashRef}
        data={pageState.list}
        estimatedItemSize={200}
        keyExtractor={(item) => `comment_floor_${item.commentId}`}
        onEndReachedThreshold={0.9}
        ListHeaderComponent={
          pageState.ownerComment !== null
            ? (
                <>
                  <CommentItem
                    imgUrl={pageState.ownerComment.user.avatarUrl}
                    name={pageState.ownerComment.user.nickname}
                    time={pageState.ownerComment.timeStr}
                    likeNum={pageState.ownerComment.likedCount}
                    content={pageState.ownerComment.content}
                    replyCount={0}
                  />
                  <View style={tw`h-2 bg-gray-100`} />
                </>
              )
            : undefined
        }
        renderItem={renderItem}
        // @ts-ignore
        renderScrollComponent={BottomSheetScrollView}
        onEndReached={onEndReached}
      />
    </>
  )
}

export default BottomSheetContent
