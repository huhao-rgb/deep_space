module.exports = {
  presets: [
    'module:metro-react-native-babel-preset'
  ],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: './app',
            rootPathPrefix: '@/' // 项目别名
          }
        ]
      }
    ],
    'react-native-reanimated/plugin'
  ]
}
