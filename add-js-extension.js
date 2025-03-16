import { readFile, writeFile, readdir } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const distDirs = [resolve(__dirname, './dist/cjs'), resolve(__dirname, './dist/esm')];

async function addJsExtension(filePath) {
     let content = await readFile(filePath, 'utf8');
     content = content.replace(/from "(\.\/[^"]+)"/g, 'from "$1.js"'); // ESM import 수정
     content = content.replace(/require\("(\.\/[^"]+)"\)/g, 'require("$1.js")'); // CJS require 수정
     await writeFile(filePath, content, 'utf8');
}

async function processDistDir(distDir) {
     try {
          const files = await readdir(distDir);
          await Promise.all(
               files
                    .filter((file) => file.endsWith('.js'))
                    .map((file) => addJsExtension(resolve(distDir, file)))
          );
          console.log(`${distDir}에 .js 확장자가 추가`);
     } catch (error) {
          console.warn(`${distDir}가 존재하지 않음`);
     }
}

await Promise.all(distDirs.map(processDistDir));
