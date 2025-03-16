const path = require('path');

const typescript = require('rollup-plugin-typescript2');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json'); // JSON 플러그인 추가
const { terser } = require('rollup-plugin-terser');

const projectRoot = path.resolve(__dirname, 'src');

module.exports = [
     {
          input: 'src/index.ts',
          output: [
               {
                    file: 'dist/cjs/index.cjs',
                    format: 'cjs',
                    exports: 'named',
                    strict: false,
               },
               {
                    file: 'dist/esm/index.js',
                    format: 'esm',
                    exports: 'named',
                    strict: false,
               },
          ],
          context: 'this', // 최상위 this 문제
          plugins: [
               alias({
                    entries: [
                         { find: 'service', replacement: path.resolve(projectRoot, 'service') },
                         {
                              find: 'controller',
                              replacement: path.resolve(projectRoot, 'controller'),
                         },
                         { find: 'model', replacement: path.resolve(projectRoot, 'model') },
                         { find: 'util', replacement: path.resolve(projectRoot, 'util') },
                         { find: 'constant', replacement: path.resolve(projectRoot, 'constant') },
                         { find: 'error', replacement: path.resolve(projectRoot, 'error') },
                    ],
               }),
               resolve({ extensions: ['.ts', '.js'] }),
               commonjs({
                    ignoreTryCatch: false, // 일부 패키지에서 try-catch 최적화 방지
               }),
               json(), // JSON 플러그인 추가
               typescript({
                    tsconfig: 'tsconfig.json',
                    clean: true,
               }),
               terser(),
          ],
     },
];
