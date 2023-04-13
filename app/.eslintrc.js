module.exports = {
  root: true,
  extends: [
    'airbnb',
    'eslint:recommended',
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
  ],
  parserOptions: {
    "project": "./tsconfig.json",
  },
  rules: {
    // Supersetted by @typescript-eslint/no-non-null-assertion
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    "@typescript-eslint/no-unused-expressions": [
      "error",
      { "allowShortCircuit": true, "allowTernary": true }
    ],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    'class-methods-use-this': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    // Doesn't seem to be able to resolve files without extensions
    'import/no-unresolved': 0,
    'max-depth': ["error", { "max": 2 }],
    "no-console": "error",
    "no-else-return": "error",
    "no-nested-ternary": "error",
    "no-underscore-dangle": "error",
    "no-return-assign": "error",
    "react/destructuring-assignment": "off",
    "react/jsx-max-depth": ["error", { "max": 5 }],
    "react/jsx-props-no-spreading": "off",
    "react/no-array-index-key": "off",
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    "react/require-default-props": "off",
    "require-await": "error",
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "no-restricted-syntax": [
      "error",
      {
        "selector": "ImportDeclaration[source.value='@apollo/client'] > ImportSpecifier[imported.name=gql]",
        "message": "Please import 'gql' from '__generated__' instead."
      },
      {
        "selector": "ImportDeclaration[source.value='react-native-config'] > ImportSpecifier[imported.name=Config]",
        "message": "Please import 'Config' from 'config.ts' instead."
      },
      {
        "selector": "ImportDeclaration[source.value='react-native'] > ImportSpecifier[imported.name=/(Text(?!Style)(?!Props)|TextInput)/]",
        "message": "Please import 'Text' and 'TextInput 'from '@components' instead."
      },
    ],
  },
};
