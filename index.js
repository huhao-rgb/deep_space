import 'react-native-gesture-handler'
import TrackPlayer from 'react-native-track-player'

import { AppRegistry } from 'react-native'
import App from './app/App'
import { name as appName } from './app.json'

TrackPlayer.registerPlaybackService(() => require('./service'))
AppRegistry.registerComponent(appName, () => App)
