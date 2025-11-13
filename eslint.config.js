import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierConfig from 'eslint-plugin-prettier/recommended';
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  globalIgnores(['dist', "node_modules",
  ]),
  {
    files: ['**/*.{ts,tsx}'],
     plugins: {
      "unused-imports": unusedImports,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
     rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "varsIgnorePattern": "^_",
          "argsIgnorePattern": "^_",
        },
      ],
    },
  },
])
