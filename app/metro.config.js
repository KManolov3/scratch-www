/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('metro-config');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');

module.exports = async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      // eslint-disable-next-line require-await
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },

    resolver: {
      // We use the new React Native architecture (see https://reactnative.dev/docs/next/the-new-architecture/pillars-turbomodules).
      // To use the new architecture, we need to define our native modules as a separate package (inside of node_modules and
      // present in package.json).
      // To do that we either have to (1) deploy the package somewhere (e.g. Artifactory) or (2) use it locally via `npm add`
      // which uses symlinks. (1) is cumbersome and slow for local development as every change needs to get published, or a tool
      // such as `wml` to be used which is inconvenient.
      // However, for (2) there is a problem - the Metro bundler which React Native uses does not support symlinks (yet).
      // HOWEVER, there is a module by Microsoft which enables symlink support. It does so by overriding the resolution rules of
      // Metro (which package is defined in what directory).
      //
      // When React Native 0.72 comes out, it will support a config option `unstable_enableSymlinks: true` which enables experimental
      // symlink support without the need for an external module like `@rnx-kit/metro-resolver-symlinks`.
      //
      // In both cases (the MS module or unstable_enableSymlinks), the symlinked module needs to be under a `haste` root.
      // See https://www.npmjs.com/package/node-haste for what haste is. Since the `app` folder is a `haste` root, we can
      // put the module somewhere under `app`, which we've done. Another option is to add the module folder to `watchFolders`
      // in this config (see https://stackoverflow.com/questions/55953564/how-to-use-symlinks-in-react-native-projet).
      resolveRequest: MetroSymlinksResolver(),

      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
};
