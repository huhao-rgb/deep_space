import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Stack } from 'expo-router'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

import { tw } from '../utils'

export default function RootLayout () {
  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <Stack screenOptions={{ header: () => null }} />
    </GestureHandlerRootView>
  )
}
