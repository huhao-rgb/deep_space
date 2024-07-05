import type { FlashListProps } from '@shopify/flash-list'

export type TabFlashListProps<T> = Omit<
  FlashListProps<T>,
  'renderScrollComponent'
> & { index: number }
