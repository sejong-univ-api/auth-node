const path = require('path');

const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const { dts } = require('rollup-plugin-dts'); // 타입 빌드 플러그인 추가

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
          external: ['tslib'],
          context: 'this',
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
                    ignoreTryCatch: false,
               }),
               json(),
               typescript({
                    compilerOptions: {
                         lib: ['es2020', 'dom'],
                         target: 'es2020',
                    },
               }),
          ],
     },
     // 타입 선언 파일 빌드 추가
     {
          input: 'src/index.ts',
          output: [{ file: 'dist/types/index.d.ts', format: 'es' }],
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
               dts(),
          ],
     },
];
