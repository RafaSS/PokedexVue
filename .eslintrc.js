module.exports = {
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      '@vue/typescript/recommended',
      'plugin:prettier/recommended'
    ],
    rules: {
      'prettier/prettier': 'error'
    },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    env: {
      browser: true,
      node: true,
      es6: true
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
        }
      }
    }
}