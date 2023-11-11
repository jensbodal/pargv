/* eslint-env node */
module.exports = {
  // prettier must go last in extends
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  root: true,
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
  },
};
