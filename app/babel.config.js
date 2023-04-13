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
          '@config': './src/config',
          '@layouts': './src/layouts',
          '@lib': './src/lib',
        },
      },
    ],
  ],
};
