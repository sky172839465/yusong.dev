import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tailwind from 'eslint-plugin-tailwindcss'
import globals from 'globals'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    settings: {
      react: { version: '18.3' },
      tailwindcss: {
        config: path.join(__dirname, './tailwind.config.js')
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'comma-dangle': ['error', 'never'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'indent': ['error', 2],
      'default-param-last': ['error'],
      'no-unused-expressions': [
        'error',
        { 'allowShortCircuit': true, 'allowTernary': true }
      ],
      'react/prop-types': 'off',
      'react/jsx-max-props-per-line': ['warn', { 'when': 'multiline' }],
      'react/jsx-first-prop-new-line': ['warn'],
      'react/jsx-indent-props': [2, 2],
      'react/jsx-indent': ['error', 2],
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'react/jsx-wrap-multilines': ['error', {
        'declaration': 'parens-new-line',
        'assignment': 'parens-new-line',
        'return': 'parens-new-line',
        'arrow': 'parens-new-line',
        'condition': 'parens-new-line',
        'logical': 'parens-new-line',
        'prop': 'parens-new-line'
      }],
      'react/jsx-tag-spacing': ['error', { 'beforeSelfClosing': 'always' }],
      'jsx-quotes': ['error', 'prefer-single'],
      'react/jsx-one-expression-per-line': 'warn',
      'tailwindcss/no-custom-classname': 'off'
    }
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  },
  ...tailwind.configs['flat/recommended']
]
