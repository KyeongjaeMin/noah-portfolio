// 미리보기(공유 링크)용 묶음 만들기
// dist/ 결과물의 CSS·JS를 HTML 한 장 안에 넣고, 사진은 옆에 함께 복사합니다.
// 사용: npm run build && node scripts/build-preview.mjs
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const out = join(root, 'preview');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html이 없어요. 먼저 npm run build 를 실행하세요.');
  process.exit(1);
}

let html = readFileSync(join(dist, 'index.html'), 'utf8');

html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/g, (_, p) => {
  return `<style>${readFileSync(join(dist, p), 'utf8')}</style>`;
});
html = html.replace(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/g, (_, p) => {
  const js = readFileSync(join(dist, p), 'utf8').replace(/<\/script/gi, '<\\/script');
  return `<script type="module">${js}</script>`;
});

// 미리보기 서버가 문서 뼈대(doctype/html/head/body)를 직접 씌우므로 껍데기는 벗김
html = html
  .replace(/<!doctype html>/i, '')
  .replace(/<\/?html[^>]*>/gi, '')
  .replace(/<\/?head>/gi, '')
  .replace(/<\/?body>/gi, '')
  .replace(/<meta name="viewport"[^>]*>/i, '')
  .trim();

// <title>을 맨 앞으로
const title = html.match(/<title>[\s\S]*?<\/title>/i)?.[0] ?? '';
html = title + '\n' + html.replace(title, '');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'index.html'), html);
for (const d of ['photos', 'films']) cpSync(join(dist, d), join(out, d), { recursive: true });
for (const f of ['favicon.svg', 'og-image.jpg']) cpSync(join(dist, f), join(out, f));
console.log('preview/ 준비 완료');
