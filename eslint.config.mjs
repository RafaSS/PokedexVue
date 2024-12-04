import eslint from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import typescript from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';
export default [
  eslint.configs.recommended,
  {
    files: ['**/*.{js,ts,vue}'],
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': typescript,
      prettier: prettier
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'prettier/prettier': 'error',
      ...pluginVue.configs['vue3-essential'].rules,
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
    }
  }
];