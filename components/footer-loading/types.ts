import type { ReactNode } from 'react'

export interface FooterLoadingProps {
  loading: boolean
  ended: boolean
  noText?: string
  loadingText?: string
  renderText?: () => ReactNode
}
