// eslint.config.js

import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-node';
import promisePlugin from 'eslint-plugin-promise';
import prettierPlugin from 'eslint-plugin-prettier';

import prettierConfig from './prettier.config.js';

/**
 * @type {import("eslint").Linter.FlatConfig[]}
 * `Flat Config` 방식의 ESLint 설정 파일
 */
export default [
     {
          languageOptions: {
               ecmaVersion: 'latest', // 최신 ECMAScript 버전 사용
               sourceType: 'module', // ES 모듈(import/export) 사용
               parser: tsParser, // ts parser 사용
          },
          ...eslint.configs.recommended,
          plugins: {
               import: importPlugin,
               node: nodePlugin,
               promise: promisePlugin,
               prettier: prettierPlugin,
               '@typescript-eslint': tseslint,
          },
          ignores: ['node_modules', 'dist'],
          rules: {
               // Prettier 규칙을 ESLint에서 실행
               ...prettier.rules,
               'prettier/prettier': ['error', prettierConfig],

               'import/order': [
                    'warn',
                    {
                         groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                         'newlines-between': 'always',
                    },
               ],

               'node/no-missing-import': 'off',
               'import/no-unresolved': 'error',

               'node/no-unsupported-features/es-syntax': 'off',

               'promise/always-return': 2, // 항상 순수 함수로 유지
               'promise/no-nesting': 'warn', // 중첩된 then() 방지

               'no-unused-vars': 'warn', // 사용되지 않는 변수는 경고
               'no-console': 'off', // console.log() 사용 허용
          },
          settings: {
               'import/resolver': {
                    typescript: {
                         alwaysTryTypes: true,
                         project: './tsconfig.json',
                    },
               },
               node: {
                    extensions: ['.ts', '.js'],
               },
          },
     },
];
