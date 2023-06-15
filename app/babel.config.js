module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: './',
        alias: {
          src: './src',
          '@apps': './src/apps',
          '@assets': './src/assets',
          '@components': './src/components',
          '@services': './src/services',
          '@config': './src/config',
          '@layouts': './src/layouts',
          '@lib': './src/lib',
          '@hooks': './src/hooks',
        },
      },
    ],
  ],
};
