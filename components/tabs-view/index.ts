/**
 * fork from https://github.com/satya164/react-native-tab-view
 * 在原库的基础上优化性能，精简项目
 * 将原库使用react native的Animated组件更改为react-native-reanimated
 */
import TabsView from './TabsView'

import { useTabsViewContext } from './Context'

export * from './types'
export {
  useTabsViewContext
}
export default TabsView
