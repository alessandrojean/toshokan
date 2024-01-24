import process from 'node:process'
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '*.md',
    '.vscode/**',
    '.husky/**',
    'dist/**',
    'node_modules/**',
    '.netlify/**',
  ],

  typescript: true,
  vue: true,

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'vue/custom-event-name-casing': 'off',
    'vue/prefer-separate-static-class': 'off',
    'vue/no-dupe-keys': 'off',
    'vue/no-extra-parens': 'off',
    'style/brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'curly': ['error', 'all'],
  },
})
