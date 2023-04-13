module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: './',
        alias: {
          src: './src',
          '@assets': './src/assets',
          '@components': './src/components',
          '@lib': './src/lib',
        },
      },
    ],
  ],
};
