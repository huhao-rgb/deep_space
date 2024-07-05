import type { ListItemProps } from '../list-item'

export type SongInfoItemProps = Pick<
ListItemProps,
| 'index'
| 'picUrl'
| 'onPress'
> & {
  isVip?: boolean
  name: string
  alName?: string // 专辑名
  arName?: string // 歌曲名称
  showMvIcon?: boolean
  onToMv?: () => void
  onMore?: () => void
}
