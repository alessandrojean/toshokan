module.exports = {
  root: true,
  plugins: ['prettier'],
  env: {
    browser: true,
    node: true
  },
  extends: ['plugin:vue/vue3-essential', 'prettier', 'plugin:storybook/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': ['warn', {
      semi: false,
      printWidth: 80,
      singleQuote: true,
      trailingComma: 'none'
    }]
  }
};