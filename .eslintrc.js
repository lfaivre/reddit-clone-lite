// @docs https://eslint.org/docs/user-guide/configuring#specifying-parser-options
// @docs https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md
// @docs https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: './tsconfig.json',
    tsconfigRootDir: '.',
  },
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
  },
  settings: {
    react: { version: 'detect' },
  },
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'prettier',
    'prettier/react',
    'prettier/unicorn',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'eslint-comments', 'jest', 'promise', 'unicorn'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true, allowTypedFunctionExpressions: true },
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
    'eslint-comments/no-unused-disable': 'error',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'no-console': 'off',
    'no-prototype-builtins': 'off',
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prevent-abbreviations': 'off',
  },
};
