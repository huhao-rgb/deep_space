module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
      "expo-router/babel",
      [
        'module-resolver',
          {
            alias: {
            'crypto': 'react-native-quick-crypto',
            'stream': 'stream-browserify',
            'buffer': '@craftzdog/react-native-buffer',
          },
        },
      ]
    ]
  };
};
