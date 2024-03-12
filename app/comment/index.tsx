import type { FC } from 'react'
import {
  useState,
  useCallback,
  useRef,
  useMemo
} from 'react'

import {
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native'

import { useGlobalSearchParams } from 'expo-router'
import type { ListRenderItem } from '@shopify/flash-list'
import {
  useAnimatedScrollHandler,
  useSharedValue
} from 'react-native-reanimated'
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import type {
  BottomSheetBackdropProps,
  BottomSheetHandleProps
} from '@gorhom/bottom-sheet'

import { useWyCloudApi } from '@/hooks'
import { tw } from '@/utils'

import CommentHeader from './CommentHeader'
import CommentItem from './CommentItem'
import BottomSheetContent from './BottomSheetContent'

import { PagingListFlashList } from '@/components/paging-list'
import type { Paging, CustomResponse } from '@/components/paging-list'
import ReplyInputbox from '@/components/reply-inputbox'
import BottomSheetHandle from '@/components/bottom-sheet-handle'

import { SortType } from '@/api/types'
import type { Comment as CommentType, CommentNewRes } from '@/api/types'

interface CommentData {
  commentsTitle: string
  totalCount: number
}

const isIos = Platform.OS === 'ios'

const Comment: FC = () => {
  const params = useGlobalSearchParams()

  const commentNewApi = useWyCloudApi<CommentNewRes>('commentNew')

  const [sortType, setSrotType] = useState(SortType.RECOMMEND)
  const [commentData, setCommentData] = useState<CommentData>({
    commentsTitle: '',
    totalCount: 0
  })
  const [parentCommentId, setParentCommentId] = useState<null | number>(null)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const parentCommentIdRef = useRef<number | null>(null)

  const scrollOffsetY = useSharedValue(0)

  const snapPoints = useMemo(() => ['90%'], [])

  const onCustomApi = useCallback(
    (paging: Paging) => {
      return new Promise<CustomResponse<CommentType>>((resolve, reject) => {
        const { offset, limit } = paging
        const pageNo = offset + 1

        commentNewApi({
          data: {
            type: params.type,
            id: params.id,
            pageSize: limit,
            pageNo,
            sortType
          },
          recordUniqueId: `${params.type}_${params.id}_${offset}`
        })
          .then(response => {
            const { status, body } = response
            if (status === 200 && body.code === 200) {
              const { comments, totalCount, commentsTitle } = body.data
              setCommentData({
                commentsTitle: commentsTitle,
                totalCount: totalCount
              })

              const currentTotal = limit * pageNo
              resolve({
                total: totalCount,
                ended: currentTotal >= totalCount,
                list: comments
              })
            } else {
              reject('network error')
            }
          })
          .catch((e) => { reject(e) })
      })
    },
    [params, sortType]
  )

  const onHandleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        parentCommentIdRef.current = null
      }
    },
    []
  )

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffsetY.value = event.contentOffset.y
    }
  })

  const renderItem = useCallback<ListRenderItem<CommentType>>(
    ({ item }) => {
      const {
        commentId,
        user,
        content,
        timeStr,
        likedCount,
        replyCount
      } = item

      const onPressReply = () => {
        setParentCommentId(commentId)
        bottomSheetModalRef.current?.present()
      }

      return (
        <CommentItem
          imgUrl={user.avatarUrl}
          name={user.nickname}
          time={timeStr}
          likeNum={likedCount}
          content={content}
          replyCount={replyCount}
          onPressReply={onPressReply}
        />
      )
    },
    []
  )

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  )

  const renderHandle = useCallback(
    (props: BottomSheetHandleProps) => <BottomSheetHandle {...props} />,
    []
  )

  return (
    <>
      <KeyboardAvoidingView
        behavior={isIos ? 'padding' : 'height'}
        keyboardVerticalOffset={StatusBar.currentHeight}
        style={tw`flex-1`}
      >
        <PagingListFlashList
          estimatedItemSize={200}
          renderItem={renderItem}
          limit={20}
          keyExtractor={(item) => `comment_item_${item.commentId}`}
          ListHeaderComponent={
            <CommentHeader
              imgUrl={(params.imgUrl as string) ?? ''}
              title={(params.title as string) ?? ''}
              subtitle={(params.subtitle as string) ?? ''}
              sortType={sortType}
              totalCount={commentData.totalCount}
              commentsTitle={commentData.commentsTitle}
              offsetY={scrollOffsetY}
            />
          }
          onCustomApi={onCustomApi}
          onScroll={onScroll}
        />

        <ReplyInputbox />
      </KeyboardAvoidingView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleComponent={renderHandle}
        onChange={onHandleSheetChange}
      >
        <BottomSheetContent
          resourceId={params.id as string}
          type={params.type as string}
          parentCommentId={parentCommentId}
        />
      </BottomSheetModal>
    </>
  )
}

export default Comment
